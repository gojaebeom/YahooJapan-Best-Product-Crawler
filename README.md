## 야후(일본) 베스트 상품 크롤러 🚀
![이미지](https://github.com/gojaebeom/AmozonReviewCounter/blob/main/thumbnail.png)
💡 CORS 등 보안사항이 있어 직접 아마존 사이트에 들어가 DOM을 변조하여 크롤링하는 방법을 사용합니다.

### 사용 목적 
- 야후 제펜의 인기 상품의 데이터 수집

### 사용 방법
1. [야후제펜 쇼핑](https://shopping.yahoo.co.jp/) 사이트에 접속한다. 
2. (윈도우 os 기준) F12 키를 눌러 개발자모드의 콘솔창을 켠다.
3. app2.0 파일의 소스코드를 전체 복사하여 실행한다.
4. 다른 새창을 키고 [카테고리 페이지](https://shopping.yahoo.co.jp/ranking/?sc_i=shp_pc_ranking-brand_themeLink_ranking)에 접속하여 원하는 카테고리에 들어간다.
5. 들어간 카테고리의 url을 복사하여 제한날짜를 지정하여 탐색한다.([샘플](https://shopping.yahoo.co.jp/ranking/?sc_i=shp_pc_ranking-brand_themeLink_ranking))
6. 제한날짜는 현재 날짜를 기준으로 몇일 전까지 댓글을 탐색할지 정하는 날짜