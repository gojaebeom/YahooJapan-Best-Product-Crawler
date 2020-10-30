## 야후(일본) 베스트 상품 크롤러 🚀
![이미지](https://github.com/gojaebeom/YahooJapan-Best-Product-Crawler/blob/main/thumbnail.png)
💡 CORS 등 보안사항이 있어 직접 야후제펜 사이트에 들어가 DOM을 변조하여 크롤링하는 방법을 사용합니다.

### 사용 목적 
- 야후 제펜의 인기 상품의 데이터 수집

### 사용 방법
1. [야후제펜 쇼핑](https://shopping.yahoo.co.jp/) 사이트에 접속한다. 
2. (윈도우 os 기준) F12 키를 눌러 개발자모드의 콘솔창을 켠다.
3. app 파일의 소스코드를 전체 복사하여 실행한다.
4. 다른 새창을 키고 [카테고리 페이지](https://shopping.yahoo.co.jp/ranking/?sc_i=shp_pc_ranking-brand_themeLink_ranking)에 접속하여 원하는 카테고리에 들어간다.
5. 들어간 카테고리의 url을 복사하여 제한날짜를 지정하여 탐색한다.([샘플](https://shopping.yahoo.co.jp/ranking/?sc_i=shp_pc_ranking-brand_themeLink_ranking))
6. 제한날짜는 현재 날짜를 기준으로 몇일 전까지 댓글을 탐색할지 정하는 날짜`
7. 탐색 이후 개발자모드 -> Network 에서 `getitemreview?`를 검색해보면 json 데이터들이 나오는데 순서대로 url을 복사해서 상품의 검색리뷰수 input 박스에 붙여넣기한다.
8. 리뷰 수에 따라 시간이 다소 걸리게 되고, 완료시 인풋박스가 사라지고 택스트만 남게 된다.
9. 사용자의 데이터베이스에 데이터를 넣으려면 `reviewParser` 함수의 하단부에서 해당 로직을 작성하면 된다.

### 제한사항🛠
- 리뷰 json url이 안받아와지는 품목이 있다. 
- 전체리뷰수가 없는 상품이 있다. (해당 상품 페이지에 접속해보면 실제로 리뷰가 존재하나 야후 재팬 사이트 상품이 아니기때문에 댓글을 가져오기 힘들다.)
- 리스트를 여러번 출력해야 하는 경우 iframe 초기화를 진행 후 새로운 상품 url을 추가해야한다.
- iframe으로 상품정보를 가져오기때문에 언어가 일본어이다... 