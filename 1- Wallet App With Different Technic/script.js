
//selectors

const ekleBtn = document.getElementById("ekle-btn");
const gelirInput = document.getElementById("gelir-input");
const ekleFormu = document.getElementById("ekle-formu");

// Variables

let gelirler = 0;
let harcamaListesi = [];

//Hesap tablosu

const gelirinizTd = document.getElementById("geliriniz")
const giderinizTd = document.getElementById("gideriniz")
const kalanTd = document.getElementById("kalan")
const kalanTh = document.getElementById("kalanTh")

//harcama Formu
const harcamaFormu = document.getElementById("harcama-formu")
const harcamaAlaniInput = document.getElementById("harcama-alani")
const tarihInput = document.getElementById("tarih")
const miktarInput = document.getElementById("miktar")

//harcama tablosu
const harcamaBody = document.getElementById("harcama-body")
const temizleBtn = document.getElementById("temizle-btn")


//Ekle Formu

ekleFormu.addEventListener("submit", (e) =>{
    e.preventDefault()
    gelirler = gelirler + Number(gelirInput.value)
    //  gelen veri string olduğu için numbera çevrilmesi gereklidir.
    console.log(gelirler)
    localStorage.setItem("gelirler", gelirler)
    gelirinizTd.innerText = gelirler
    // formun içerisini gönderme işleminden sonra boşalt
    ekleFormu.reset()
    hesaplaveGuncelle()
})

window.addEventListener("load",()=>{
    gelirler = Number(localStorage.getItem("gelirler")) || 0
    // eğer gelirler boş ise engellemek için 0 döndür denir.
    gelirinizTd.innerText = gelirler
    // bugünün tarihinin gelmesini sağlar.
    tarihInput.valueAsDate = new Date()
    harcamaListesi = JSON.parse(localStorage.getItem("harcamalar")) || []
    harcamaListesi.forEach((harcama)=>harcamayiDomaYaz(harcama))
    hesaplaveGuncelle()

})


harcamaFormu.addEventListener("submit", (e)=>{
    e.preventDefault(); // reloadı engeller
    const yeniHarcama = {
        //  unique id oluşturmak için kullanıldı.
        id: new Date().getTime(),
        tarih: tarih.value,
        alan: harcamaAlaniInput.value,
        miktar: miktar.value
    }

    console.log(yeniHarcama);
    harcamaFormu.reset();
    // valueyi tarih olarak ata demektir. new date de bize bugünün tarihini verir.
    tarihInput.valueAsDate = new Date()

    harcamaListesi.push(yeniHarcama)

    console.log(harcamaListesi);

    // stringleştir ve harcama listesi adıyla localStorage a yolla.
    localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi))
    harcamayiDomaYaz(yeniHarcama)
    tarihInput.valueAsDate = new Date()
})


// fonksiyonun içerisine obje adı yazıldı.
// fonksiyona girmeden objedeki veriler alındı.
const harcamayiDomaYaz = ({id, miktar, tarih, alan}) =>{
    // console.log(yeniHarcama);
    // const {id, niktar, alan} = yeniHarcama
    // console.log(id, miktar, tarih, alan);
    // harcamaBody.innerHTML += `
    // <td>${miktar}</td>
    // <td>${tarih}</td>
    // <td>${alan}</td>
    // <td><i=${id} class="fa-solid fa-trash-can text-danger" type="button"></td>

    // `

    const tr = document.createElement("tr")
    const appendTd = (content) =>{
        const td = document.createElement("td")
        td.textContent = content;
        return td;
    }

    // appendin içerisine birden fazla fonksiyon ile aynı anda birden fazla sütun eklenebilir.
    const createLastTd = () =>{
        const td = document.createElement("td");
        const iElement = document.createElement("i")
        iElement.id = id;
        iElement.className = "fa-solid fa-trash-can text-danger"
        iElement.setAttribute("style", "cursor:pointer")
        iElement.type = "button"
        td.appendChild(iElement);
        return td;
    }

    tr.append(
        appendTd(tarih),
        appendTd(alan),
        appendTd(miktar),
        createLastTd()
    )

    harcamaBody.append(tr) // harcamayı sona ekler
    // harcamaBody.prepend(tr) // harcamayı öne ekler

}


const hesaplaveGuncelle = () =>{
    gelirinizTd.innerText = gelirler;
    const giderler = harcamaListesi.reduce((toplama, harcama)=> toplama + Number(harcama.miktar),0)

    giderinizTd.innerText = giderler; // gider toplamını ekrana yaz.
    kalanTd.innerText = gelirler - giderler;

    const borclu = gelirler - giderler < 0;

    // kaldırılacak alan ve eklenecek alan
    kalanTd.classList.toggle("text-danger", borclu)
    // kalanTh.classList.toggle("text-danger", borclu)
}

harcamaBody.addEventListener("click", (e)=>{
    console.log(e.target);
    if(e.target.classList.contains("fa-trash-can")){
        e.target.parentElement.parentElement.remove();
    }
    const id = e.target.id;

    // silinen harcamayı arrayden çıkarır.
    harcamaListesi = harcamaListesi.filter(harcama => harcama.id != id)
    localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi))
    // gelen harcama listesini idye göre tekrar oluştur. ve locale haber ver.
    hesaplaveGuncelle();
});


temizleBtn.addEventListener("click", () =>{
    if(confirm("Are you sure you want to delete this?")){
        harcamaListesi = [] // tüm harcamaları listeden siler
        gelirler = 0 // gelirler sıfırlanır.
        localStorage.clear();
        harcamaBody.innerHTML = "";
        hesaplaveGuncelle();
    }
})