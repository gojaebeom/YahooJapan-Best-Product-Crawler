/* DOM 그리기 🎨 */
domRedraw();
function domRedraw()
{
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";
    document.body.style.background = "linear-gradient(#F7FE2E, #FE9A2E)";
    document.body.innerHTML = `
    <form id="bestForm" style="width:800px;padding:12px;border-radius:5px;background:#FFFFFF;">
        <h1 style="color:'#2E2E2E';margin:10px 0px 20px 0px;font-size:20px;font-weight:bold;">야후 베스트 상품 크롤러 🥪</h1>
        <label for="bestUrl">Best 상품 URL 20개 추출하기</label>
        <input id="bestUrl" style="width:100%;padding:12px 8px;border: 1px solid #BDBDBD;border-radius:3px;"><br><br>
        <label for="date">제한날짜를 입력하세요</label><br>
        <input id="date" type="date" style="width:30%;padding:12px 8px;border: 1px solid #BDBDBD;border-radius:3px;">
        <button type="button" id="bestButton" style="padding:13px 15px;border:none;border-radius:3px;background:#FE9A2E;color:white;font-weight:bold;">탐색</button>
        <br>
        <br>
        <label for="date">상품번호를 클릭하면 해당 상품페이지로 이동합니다.</label>
        <table style="border-collapse:collapse;border: 1px solid #BDBDBD;width:100%;">
            <tr>
                <th style="border: 1px solid #BDBDBD;padding:8px;">No</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">상품번호</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">가격</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">전체리뷰수</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">검색리뷰수</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">채널이름</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">카테고리</th>
            </tr>
            <tbody id="productIdTbody" style="max-height:300px;overflow:hidden;"></tbody>
        </table>
    </form>
    <div id="bestIframeWrap" style="display:none;"></div>
    <div id="reviewIframeWrap" style="display:none;"></div>
    `;
}
/* 사용하기 편하게 dom을 변수에 할당 🚗 : url, date, 버튼 */
const bestButton = document.getElementById('bestButton');
const bestUrl = document.getElementById('bestUrl');
const dateInput = document.getElementById('date');


/* 탐색버튼 클릭 이벤트 🔥 */
bestButton.onclick = async () => {

    console.log('탐색 시작');
    
    //url, date 미 입력시 빠꾸
    if(!bestUrl.value || !dateInput.value)
    {
        alert('url, date는 필수 입력값입니다. ☹');
        return false;
    }

    let {category, products} = await bestProductList(bestUrl.value);
    let i = 0;
    for(let product of products)
    {
        ++i;
        console.log(product.title);
        console.table(
        {
            'no':i,
            '상품명':product.title,
            '카테고리':category,
            '상품가격':product.price,
            '전체 리뷰 수':product.totalReview
        });
    }
}

/* TOP 20 상품 리스트 가져오기 */
async function bestProductList(url)
{
    return new Promise((resolve, reject)=>
    {
        console.log(url);
        //아이프레임 생성, url 할당, id 속성 생성, 문서에 추가, 해당 dom을 변수에 할당
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.setAttribute('id','rankingListIframe');
        document.getElementById('bestIframeWrap').appendChild(iframe);
        const rankingListIframe = document.getElementById('rankingListIframe');

        rankingListIframe.onload = () => 
        {       
            const category = rankingListIframe.contentWindow.document.querySelector(`#shpMain div.mdConditionsDisplay strong`).textContent;
            console.log(category);

            const products = [];
            let title;
            let price;
            let totalReview;
            for(let i = 0; i < 20; i++)
            {
                title = rankingListIframe.contentWindow.document.querySelector('#ranking > ol')
                                .getElementsByClassName('isReflect')[i].querySelector('.elTitle > a').textContent.trim();
                price = +rankingListIframe.contentWindow.document.querySelector('#ranking > ol')
                                .getElementsByClassName('isReflect')[i].querySelector('.elPriceBody').textContent.replaceAll(',', "");
                totalReview = (rankingListIframe.contentWindow.document.querySelector('#ranking > ol')
                            .getElementsByClassName('isReflect')[i].querySelector('.elReview > a')) ? 
                            +rankingListIframe.contentWindow.document.querySelector('#ranking > ol')
                            .getElementsByClassName('isReflect')[i].querySelector('.elReview > a').textContent.trim().split('件')[0] : 0 ;
                products.push({title,price,totalReview});
            }
            resolve({category, products});
        }
    })
}