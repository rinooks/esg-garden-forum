# 대한민국 ESG정원정책포럼 독립 복제 패키지

## 현재 상태
- 2026-11-13 원본의 활성 버전 eb937abb-de09-40e9-ad15-9c77c217a1bc에서 코드 11개를 확보했습니다.
- 원본 사이트: https://esg-garden-forum.rinooks.workers.dev/
- 코드 및 DB가 참조하는 이미지·첨부 정적 자산 97개를 다운로드했습니다. 사용되지 않는 미참조 자산까지 전체 열거한 것은 아닙니다.
- DB 스냅샷에서 페이지 27개, 게시물 4개를 복제했습니다. 별도 업로드 파일 테이블은 원본에서도 비어 있었습니다.
- 기존 관리자 비밀번호 해시, 로그인 세션, 요청 제한 기록, 문의, 접속 통계는 인계 DB에 포함하지 않습니다. 실제 문의는 0건이었습니다.
- 원본 Worker·DB·도메인·시크릿·예약 실행은 수정하거나 삭제하지 않았습니다. 읽기 전용 조회와 백업 내보내기만 실행했습니다.
- 상대방 계정은 아직 연결되지 않았으므로 실제 대상 계정 배포와 Cloudflare 실서버 검증은 미완료입니다.

## 파일
- src/: 현재 배포된 서버·관리자·화면 코드 11개
- public/assets/: 참조 정적 자산 97개
- database.sql: 새 DB 전용 초기 복원 SQL. 운영 인증·세션·통계는 초기화
- configure-target.mjs: 대상 전용 설정 생성. 원본 계정과 원본 DB를 명시적으로 차단
- setup-secrets.ps1: 새 관리자 비밀번호를 숨김 입력하고 새 시크릿을 Cloudflare로 등록. 비밀번호·시크릿을 파일로 저장하지 않음
- verification.json, runtime-verification.json: 데이터 무결성 및 로컬 실행 검사 결과

## 대상 계정 연결
상대방은 자신의 Cloudflare 계정에서 준형님의 Cloudflare 로그인 이메일을 계정 멤버로 초대하고, Workers 편집/배포와 D1 편집에 필요한 권한을 부여합니다. 상대방 계정의 Account ID를 확인합니다. 비밀번호 공유는 필요 없습니다. 배포 후 준형님 권한을 유지할지는 상대방이 결정합니다.

## 대상 계정 배포 순서
Node.js LTS와 PowerShell 7이 필요합니다. 일반 터미널의 인터넷 연결이 필요하며, 브라우저로 HTML을 직접 여는 패키지가 아닙니다. 사이트는 Worker 서버와 D1 DB가 있어야 동작합니다.

아래 명령은 이 폴더에서 실행합니다. Account ID와 DB UUID는 상대방 계정 값으로 대체합니다.

```powershell
npm install
npx wrangler login
npx wrangler whoami
```

1. Cloudflare 대시보드에서 **상대방 계정**을 선택합니다.
2. D1 데이터베이스 `esg-garden-forum-clone-db`를 새로 만듭니다. 기존 DB를 재사용하지 않습니다.
3. 생성된 DB UUID와 상대방 Account ID로 아래를 실행합니다.

```powershell
node configure-target.mjs <상대방_ACCOUNT_ID> <새_D1_UUID>
npx wrangler d1 execute esg-garden-forum-clone-db --remote --file database.sql --config wrangler.target.jsonc
npx wrangler deploy --config wrangler.target.jsonc
pwsh -File ./setup-secrets.ps1
```

- SQL은 빈 신규 DB에 한 번만 적용하세요. 기존 데이터가 있는 DB에 반복 적용하지 마세요.
- 대상 계정에 이미 `esg-garden-forum` Worker가 있다면 중단하고 새 Worker 이름을 정하세요. 기존 Worker를 덮어쓰지 마세요.
- `configure-target.mjs`는 설정 파일이 이미 있으면 덮어쓰지 않습니다.
- 기존 비밀번호는 전달하지 않고 복제본용 비밀번호를 새로 정합니다. PBKDF2-SHA256 100,000회 방식으로 원본 인증 코드와 호환됩니다.
- 새 SESSION_KEY는 별도 난수로 생성됩니다.
- 예약 정리는 원본과 동일하게 매일 18:00 UTC, 한국시간 다음 날 03:00에 실행합니다.
- Workers 및 D1의 사용량·요금은 상대방 계정에 귀속됩니다. 유료 요금제·결제·R2 구독을 자동 활성화하지 않습니다.

## 인계 전 확인
- 새 주소의 `/api/health`에서 ok:true
- 메인, 소개, 대표자 인사말, 게시물, `/village`, 이미지 표시
- `/admin`에서 새 비밀번호 로그인, 페이지·게시물 수정/저장
- 문의를 복제본에서 테스트하고, 복제본 DB에만 저장되는지 확인 후 테스트 문의 삭제
- 원본 DB UUID와 대상 UUID가 다른지 확인
- 원본 주소가 계속 정상 작동하는지 확인
- 연락처·메일·개인정보 안내·외부 링크는 원본 콘텐츠 그대로이므로 인계받는 운영 주체가 실제 운영 정보에 맞게 검토

## 유지관리
복제 시점 이후 양쪽은 자동 동기화되지 않습니다. 상대방은 새 주소 또는 자신의 소유 도메인을 연결해 운영합니다. `rinooks.workers.dev` 주소는 원본 계정에 그대로 남으며, 이 패키지는 원본 정리나 주소 이전을 수행하지 않습니다.
