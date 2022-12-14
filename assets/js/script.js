let cart = [];
let modalQT = 1;
let modalKey = 0;

const c = (a)=>document.querySelector(a);
const cs = (a)=>document.querySelectorAll(a);


//Adicionando os elementos na tela
pizzaJson.map((item,index)=>{
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
    pizzaItem.setAttribute('data-item',index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item a').addEventListener('click',(e)=>{
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-item');
        modalQT = 1;
        modalKey = key;
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        c('.pizzaInfo--size.selected').classList.remove('selected')
        cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
            if(sizeIndex > 1){
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })
        c('.pizzaInfo--qt').innerHTML = modalQT;
        c('.pizzaWindowArea').style.opacity = 0
        c('.pizzaWindowArea').style.display = 'flex'
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1
        },200)
    })

    document.querySelector('.pizza-area').append(pizzaItem)
})

//Eventos de click


cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
    size.addEventListener('click',()=>{
        c('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    let sizepizza = c('.pizzaInfo--size.selected').getAttribute('data-key')
    if(sizepizza == '0'){
        c('.pizzaBig img').style.width = '200px'
        c('.pizzaBig img').style.height = '200px'
    } else if(sizepizza == '1'){
        c('.pizzaBig img').style.width = '300px'
        c('.pizzaBig img').style.height = '300px'
    } else if(sizepizza == '2'){
        c('.pizzaBig img').style.width = '400px'
        c('.pizzaBig img').style.height = '400px'
    }
    });
})
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQT++;
    c('.pizzaInfo--qt').innerHTML = modalQT;
})
c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQT > 1){
        modalQT--;
        c('.pizzaInfo--qt').innerHTML = modalQT; 
    }
})
cs('.pizzaInfo--cancelButton,.pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',CloseModal)
})

//Fun????o que vai fechar o cancelar
function CloseModal(){
    c('.pizzaWindowArea').style.opacity = 0
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none'
    },200)
}

c('.pizzaInfo--addButton').addEventListener('click',()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size
    let key = cart.findIndex((item)=>item.identifier == identifier)

    if(key > -1){
        cart[key].qt += modalQT
    } else {
    cart.push({
        identifier,
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQT
    })
}
    UpdateCart();
    CloseModal();
})

//Abrindo o carrinho de compras

c('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
        c('aside').style.left = '0px'
    }
})

c('.cart--finalizar').addEventListener('click',()=>{
    c('aside').classList.remove('show')
})
function UpdateCart(){
    c('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0){
        c('aside').classList.add('show')
        c('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id)
            let cartItem = c('.models .cart--item').cloneNode(true)
            subtotal += pizzaItem.price * cart[i].qt

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break;
                case 2:
                    pizzaSizeName = 'G'
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                UpdateCart()
            })
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i,1)
                }
                UpdateCart()
            })
            c('.cart--finalizar').addEventListener('click',()=>{
                c('aside').style.left = '200vw'
            })
            c('.menu-closer').addEventListener('click',()=>{
                c('aside').style.left = '200vw'
            })

            c('.cart').append(cartItem)
            
        }
        desconto = subtotal * 0.1
        total = subtotal - desconto
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show')
        c('aside').style.left = '200vw'
    }

}
  