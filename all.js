// ---宣告常數及變數---

const ProductList = document.querySelector('.ProductList');
// let CardsHTML = ""; 
ProductList.innerHTML = "";
let CurrentPage = 1; //預設是第一頁
const PageBtns = document.querySelector('.PageBtns'); 
let ProductsPerPage = 9; //每頁最多顯示9個
let AllProductData =[];

// ---以下是function區---

// 初始功能：拿取資料，啟動接下來的function
async function getData() {
    setProductsPerPage(); //先決定當前版面
    try{
        const Response = await axios.get('./products-new.json');
        AllProductData = Response.data;  //將資料陣列整個取出
        showPage(1);
    }
     catch(error){
        console.error('資料讀取錯誤:',error);
    }    
}


// 功能：渲染指定的資料
function renderProducts(dataToShow) {
    let CardsHTML = ""; //每次換頁都清空，不然會一直疊加
    dataToShow.forEach(function(item){
    CardsHTML= CardsHTML+productCard(item); // 每執行1筆，CardsHTML會再加入下一筆資料，以此類推到第40筆執行完畢
    })
    ProductList.innerHTML = CardsHTML; 

    //console.log(CardsHTML); //檢查是否成功完成40筆HTML
    }
   

// 功能：產生單一張產品卡片li的HTML

function productCard(data){

//     let data = {
//     "id": 1,
//     "series": "STREETMODE",
//     "seriesCh": "滑板系列",
//     "pic": "./Images/Product-Card-PLATFORM 404-black.png",
//     "product_name": "PLATFORM 404",
//     "price": 2600,
//     "description": "",
//     "colors": "",
//     "focus": false,
//     "Material": ""
//     };

    let Card = `
        <li class="ProductCard">
            <a href="#">
                <figure>
                    <img src="${data.pic}" alt="${data.product_name}">
                    <figcaption>
                        <p class="ProductName">${data.product_name}</p>
                        <p class="ProductPrice">NT$${data.price.toLocaleString()}</p>
                    </figcaption>
                </figure>
            </a>
        </li>
    `;
    //console.log(Card);

    return Card; //將執行結果丟回Card
}

// 根據當前頁數判斷從哪裡筆資料開始渲染

function showPage(CurrentPage){
    const StartIndex = (CurrentPage-1)*ProductsPerPage; //開始位置。舉例（第２頁從陣列的第9個index開始切，因為陣列index是從0開始，所以等於是第10筆資料沒錯
    const EndIndex = StartIndex + ProductsPerPage; //結束位置
    const pageData = AllProductData.slice(StartIndex,EndIndex); // 切出渲染範圍
    renderProducts(pageData);
}

// 功能：RWD，行動版每頁顯示10筆

function setProductsPerPage(){
    if(window.innerWidth <= 768){
        ProductsPerPage = 10;
    }
    else{
        ProductsPerPage = 9;
    }
}




// ---設定監聽事件---

// 分頁按鈕
PageBtns.addEventListener("click",function(event){
    
    //按鈕取值，設定執行頁數
    const clickValue = event.target.value;
    let targetPage = CurrentPage;
    
    if(clickValue === "prev"){
        targetPage = targetPage-1;
    } 
    else if(clickValue === "next"){
        targetPage = targetPage+1;
    }
    else{
        targetPage = parseInt(clickValue); //若不是上下頁，就直接取用值。
    }

    //目的：避免超出總頁數範圍
    const totalPages = Math.ceil(AllProductData.length/ProductsPerPage) //先計算總頁數

    if(targetPage<1){
        targetPage = 1;
    }

    if(targetPage > totalPages){
        targetPage = totalPages;
    }

    if(targetPage !== CurrentPage){
        CurrentPage = targetPage;
        showPage(CurrentPage);
    }
    
    });
    

// 視窗寬度變化
window.addEventListener("resize",function(){
    setProductsPerPage(); 
    showPage(CurrentPage);
})


// ---執行指令區---
getData();

