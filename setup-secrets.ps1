#Requires -Version 7.0
$ErrorActionPreference='Stop'
Set-Location $PSScriptRoot
if (!(Test-Path 'wrangler.target.jsonc')) { throw 'configure-target.mjs로 대상 전용 설정부터 생성하세요.' }
$config=Get-Content 'wrangler.target.jsonc' -Raw | ConvertFrom-Json
if ($config.account_id -eq 'fff42139b43c8a63dd8bb4f5f98f64b3') { throw '원본 계정 차단' }
if ($config.d1_databases[0].database_id -eq '89b6bcbd-ebab-4638-97d0-911f836396d1') { throw '원본 DB 차단' }
$secure=Read-Host '복제본의 새 관리자 비밀번호 (12자 이상)' -AsSecureString
$ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
  $plain=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  if ($plain.Length -lt 12 -or $plain.Length -gt 200) { throw '비밀번호는 12~200자로 입력하세요.' }
  $salt=[Guid]::NewGuid().ToString()
  $bytes=[Security.Cryptography.Rfc2898DeriveBytes]::Pbkdf2([Text.Encoding]::UTF8.GetBytes($plain),[Text.Encoding]::UTF8.GetBytes($salt),100000,[Security.Cryptography.HashAlgorithmName]::SHA256,32)
  $hash=$salt+':'+[Convert]::ToHexString($bytes).ToLowerInvariant()
  $session=[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).ToLowerInvariant()
  $payload=@{ADMIN_HASH=$hash;SESSION_KEY=$session} | ConvertTo-Json -Compress
  $payload | & npx wrangler secret bulk --config wrangler.target.jsonc
  if ($LASTEXITCODE -ne 0) { throw '시크릿 등록에 실패했습니다. 대상 계정 권한을 확인하세요.' }
  Write-Host '복제본 전용 관리자 인증 설정 완료. 비밀번호와 키는 파일에 저장하지 않았습니다.'
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  $plain=$null; $payload=$null; $hash=$null; $session=$null; $bytes=$null
  $secure.Dispose()
}
