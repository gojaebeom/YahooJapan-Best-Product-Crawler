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
        <label for="date">상품이름을 클릭하면 해당 상품페이지로 이동합니다.</label>
        <table style="border-collapse:collapse;border: 1px solid #BDBDBD;width:100%;table-layout:fixed">
            <tr>
                <th style="border: 1px solid #BDBDBD;padding:8px;">No</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">상품이름</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">채널이름</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">카테고리</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">가격</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">전체리뷰수</th>
                <th style="border: 1px solid #BDBDBD;padding:8px;">검색리뷰수</th>
            </tr>
            <tbody id="productIdTbody" style="max-height:300px;overflow:hidden;"></tbody>
        </table>
        <br>
        <br>
        <button type="button" id="destroyButton" style="padding:13px 15px;border:none;border-radius:3px;background:#FE9A2E;color:white;font-weight:bold;">iframe 초기화</button>
    </form>
    <div id="bestIframeWrap" style="display:none;"></div>
    <div id="reviewIframeWrap" style="display:none;"></div>
    `;
}
/* 사용하기 편하게 dom을 변수에 할당 🚗 : url, date, button, tbody */
const bestButton = document.getElementById('bestButton');
const bestUrl = document.getElementById('bestUrl');
const dateInput = document.getElementById('date');
const productIdTbody = document.getElementById('productIdTbody');

const bestIframeWrap = document.getElementById('bestIframeWrap');
const reviewIframeWrap = document.getElementById('reviewIframeWrap');
const destroyButton = document.getElementById('destroyButton');


/* 탐색버튼 클릭 이벤트 🔥 */
bestButton.onclick = async () => 
{
    //url, date 미 입력시 빠꾸
    if(!bestUrl.value || !dateInput.value)
    {
        alert('url, date는 필수 입력값입니다. ☹');
        return false;
    }

    productIdTbody.innerHTML = '';

    //버튼 문구 변경
    bestButton.textContent = '탐색중..';

    //bestProduct 상품들을 조회, 조회가 끝나면 카테고리명과 상품 20개의 각각의 정보들을 가져옴
    let {category, products} = await getBestProductList(bestUrl.value);
    let i = 0;
    let searchReview = 0;
    for(let product of products)
    {
        productIdTbody.innerHTML += 
        `
        <tr style="height:30px;text-align:center;">
            <td>${++i}</td>
            <td title="${product.title}" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">
                <a href="${product.totalReview_url}" target="_blank" class="bestInfoTd">${product.title}</a>
            </td>
            <td class="bestInfoTd" title="${product.channelName}" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">${product.channelName}</td>
            <td class="bestInfoTd">${category}</td>
            <td class="bestInfoTd">${product.price}</td>
            <td class="bestInfoTd">${product.totalReview}</td>
            <td id="searchReview${i}">
                <input onchange="reviewParser(this)">
            </td>
        </tr>
        `;
        
        if(product.totalReview_url !== null)
        {
            await createReviewIframe(product.totalReview_url, i);
        }else
        {
            document.getElementById(`searchReview${i}`).innerHTML = 0;
        }
        console.table
        ({
            'no':i,
            '상품명':product.title,
            '카테고리':category,
            '채널이름':product.channelName,
            '상품가격':product.price,
            '전체 리뷰 수':product.totalReview,
        });
    }

    //모든 작업이 끝난 뒤 버튼, input 박스의 값을 초기화
    bestButton.textContent = '탐색';
    bestUrl.value = '';
    
}

//iframe 삭제 버튼
destroyButton.onclick = () => 
{
    while (reviewIframeWrap.hasChildNodes()) {
        reviewIframeWrap.removeChild(reviewIframeWrap.firstChild);
    }
    alert('iframe 삭제 완료🎇');
}

/* TOP 20 상품 리스트 가져오기 🥞 */
async function getBestProductList(url)
{
    return new Promise((resolve, reject)=>
    {
        //아이프레임 생성, url 할당, id 속성 생성, 문서에 추가, 해당 dom을 변수에 할당
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.setAttribute('id','rankingListIframe');
        bestIframeWrap.appendChild(iframe);
        const rankingListIframe = document.getElementById('rankingListIframe');
        
        //랭킹리스트 아이프레임의 dom이 다 생성되면 필요한 dom의 값들을 추출
        rankingListIframe.onload = () => 
        {       
            console.log(`%c top 20 rank iframe 생성`, `color:green`);

            //카테고리 값 추출 후 category 변수에 할당
            const category = rankingListIframe.contentWindow.document.querySelector(`#shpMain div.mdConditionsDisplay strong`).textContent;

            //상품 정보들을 배열에 담기 위해 products 배열 및 각 값을 담을 변수들 선언
            const products = [];
            let title;
            let price;
            let totalReview;
            let channelName;
            let totalReview_url;
            for(let i = 0; i < 20; i++)
            {
                //타이틀 값을 추출, 앞뒤 공백제거 후 title 변수에 할당
                title = rankingListIframe.contentWindow.document.querySelector('#ranking > ol')
                                .getElementsByClassName('isReflect')[i].querySelector('.elTitle > a').textContent.trim();
                //가격 값을 추출, 숫자 사이의 ','를 제거하고 정수값으로 변환 후 price 변수에 할당
                price = +rankingListIframe.contentWindow.document.querySelector('#ranking > ol')
                                .getElementsByClassName('isReflect')[i].querySelector('.elPriceBody').textContent.replaceAll(',', "");
                //전체리뷰수는 없는 상품도 있기때문에, 해당하는 dom이 있을 때만 가져옴, 없다면 0 을 반환
                totalReview = (rankingListIframe.contentWindow.document.querySelector('#ranking > ol')
                            .getElementsByClassName('isReflect')[i].querySelector('.elReview > a')) ? 
                            rankingListIframe.contentWindow.document.querySelector('#ranking > ol')
                            .getElementsByClassName('isReflect')[i].querySelector('.elReview > a') : 0;
                //totalReview가 null이 아니면 그 값을 가공해서 다시 변수에 할당, 또한 상품 리뷰 페이지로 넘어가기 위한 url도 따로 받아온다.
                if(totalReview !== 0)
                {
                    totalReview_url = totalReview.href;
                    //값의 앞뒤 공백을 제거하고 件 문자 앞의 숫자만 추출후 정수로 변환 후 totalReview 변수에 할당
                    totalReview = +totalReview.textContent.trim().split('件')[0];
                }else
                {
                    totalReview_url = null;
                }

                //스토어이름 값을 추출, 앞뒤 공백제거 후 channelName 변수에 할당
                channelName = rankingListIframe.contentWindow.document.querySelector('#ranking > ol')
                            .getElementsByClassName('isReflect')[i].querySelector('.elStore > a').textContent.trim();
                //products 배열에 객체 타입으로 값 저장
                products.push({title,price,totalReview,channelName,totalReview_url});
            }
            //best iframe 제거
            while (bestIframeWrap.hasChildNodes()) {
                bestIframeWrap.removeChild(bestIframeWrap.firstChild);
            }
            console.log(`%c top 20 rank iframe 제거`, `color:green`);

            //20개의 상품정보가 완료되면 category와 products 배열을 반환
            resolve({category, products});
        }
    })
}

/* 상품의 리뷰 json 가져오기 🍔 */
async function createReviewIframe(url, i)
{
    return new Promise((resolve, reject)=>
    {
        console.log(url);
        const iframe = document.createElement('iframe');
        iframe.setAttribute('id',`productReviewIframe${i}`);
        iframe.src = url;
        reviewIframeWrap.appendChild(iframe);

        const productReviewIframe = document.getElementById(`productReviewIframe${i}`);

        productReviewIframe.onload = () => 
        {
            console.log(`%c product rivew iframe 생성`, `color:green`);

            productReviewIframe.contentWindow.document.querySelector("#shpMain > div.gdColumns.gd2ColumnB > div.gd2ColumnB1 > div > div.mdReviewData > div > div.elReviewSortWrap > div > ul > li:nth-child(4) > a").click();

            resolve('done!');
        }
    })
}

/* json 링크를 받아 리뷰 수를 평가하고 최종적으로 db에 데이터를 보내는 함수 */
async function reviewParser(dom)
{
    let next = 1;
    let url = dom.value.split('&sort=-latest')[0];
    let sort = '&sort=-latest';
    let apicrumb = `&apicrumb=`+dom.value.split('&apicrumb=')[1].split('&results=')[0];
    let result = '&results=300';

    let json;
    let count = 0;
    let myDate = new Date(dateInput.value);

    dom.value = '리뷰 수 분석중..';
    
    let loop = true;
    try
    {   
        while(loop)
        {
            json = await fetch(url+sort+`&start=${next}`+apicrumb+result).then(res=>res.json()).then(json=>json);

            for(result of json.results)
            {
                dom.value = count;

                let date;
                date = result.Time;
                date = date.replace('年','-');
                date = date.replace('月','-');
                date = date.split('日')[0];
                date = new Date(date);
                
                console.log(`%c ${myDate}`,'color:blue');
                console.log(`%c ${date}`,'color:orange');
                
                if(myDate <= date)
                {
                    count++;
                }else
                {
                    console.log('%c 탐색 조건 불일치','color:red');
                    loop = false;
                    break;
                }
            }
            console.log(json.next);
            if(json.next == 0)
            {
                break;
            }

            next = json.next;
        }
    }catch(err)
    {
        alert('올바른 json url을 입력해주세요 🙄');
        console.error(err);
        dom.value='';
        return false;
    }

    const productTitleTd = dom.parentElement.parentElement.getElementsByClassName('bestInfoTd')[0];
    const productChannelTd = dom.parentElement.parentElement.getElementsByClassName('bestInfoTd')[1];
    const productCategoryTd = dom.parentElement.parentElement.getElementsByClassName('bestInfoTd')[2];
    const productPriceTd = dom.parentElement.parentElement.getElementsByClassName('bestInfoTd')[3];
    const productReviewTotalTd = dom.parentElement.parentElement.getElementsByClassName('bestInfoTd')[4];
    
    dom.parentElement.innerHTML = count;

    console.table
    ({
        '상품명':productTitleTd.textContent,
        '카테고리':productCategoryTd.textContent,
        '채널이름':productChannelTd.textContent,
        '상품가격':productPriceTd.textContent,
        '전체 리뷰 수':productReviewTotalTd.textContent,
        '검색 리뷰 수':count
    });

    /* ---------input your database code------------- */
}