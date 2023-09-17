// Constructor de objetos.
class Producto {
    constructor(id, nombre, imagen, precio) {
        this.id = id;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = parseFloat(precio);
    }
}
//leo db Local
const getDBProductosJSON = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    data.forEach((x) => productosTiendaBS.push(new Producto(x.id, x.nombre, x.imagen, x.precio)));
};
//Eventos
const productosItems = document.querySelector('#productos-items');
const productosCarrito = document.querySelector('#productos-carrito');
const productosPrecioTotal = document.querySelector('#productos-precio-total');
const productosconfirmaCompra = document.querySelector('#productos-btn-vaciar');
const productosComprarCarrito = document.querySelector('#productos-btn-comprar');
const productosCarritoSeleccionados = document.querySelector('#productos-items-seleccionados');
const productosCarritoLS = window.localStorage;
const confirmarCompra = document.querySelector('#btnComprar')
confirmarCompra.addEventListener('click', verificoFormulario);

//Creación de arrays vacios para productos y carrito de compras
const productosTiendaBS = [];
let carrito = [];

//Agrego al carrito
function agregarAlCarrito(id) {
    carrito.push(id);
    funActCarrito();
    funSaveCarritoLS();
    console.log(carrito);

    Toastify({
        text: "El producto seleccionado se agregó a tu carrito",
        duration: 2000,
        offset: { y: 120 },
        style: {
            background: "linear-gradient(to right, #006878, #009878)",
        },
    }).showToast();
};

//Modifico DOM mediante JS para la estructura de carrito.
function funActCarrito() {
    let html;
    productosCarritoSeleccionados.innerHTML = '';
    if (carrito && carrito.length > 0) {
        
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {

            const miItem = productosTiendaBS.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });

            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
            html = `
            <div class="info-cart-product">
                <p class="cantidad-producto-carrito fs-6 mb-0">${numeroUnidadesItem}</p>
                <img src="../images/productos/${miItem[0].imagen}" alt="${miItem[0].nombre}" class="imagen-producto-carrito"/>
                <p class="titulo-producto-carrito fs-6 mb-0">${miItem[0].nombre}</p>
                <p class="precio-producto-carrito fs-6 mb-0">$${miItem[0].precio}</p>
            </div>
            `;
            productosCarritoSeleccionados.innerHTML += html;
        });
    } else {
        html = `
        <div class="info-cart-product">
			<div class=".productos-cardDatos">
                <h5>El carrito se encuentra vacío</h5>
			</div>
        </div>
        `;
        productosCarritoSeleccionados.innerHTML = html;
    }
    
    //Precio Total
    productosPrecioTotal.innerHTML = calcularTotal();
};

//Calcula el precio total con productos repetidos
function calcularTotal() {
    return carrito.reduce((total, item) => {
        const miItem = productosTiendaBS.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        return total + miItem[0].precio;
    }, 0).toFixed(2);
};

//Vaciado de carrito y LS
function confirmaCompra() {

    Swal.fire({
        title: 'Gracias por su compra!',
        text: 'Un asesor se contactará pronto.',
        icon: 'success',
    })
    carrito.length = 0;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    funActCarrito();
    localStorage.clear();
    //setTimeout ("redireccionar()", 2500);
};

//Guardo carrito en LS
function funSaveCarritoLS() {
    productosCarritoLS.setItem('carrito', JSON.stringify(carrito));
};

//Cargo carrito desde LS
function funUploadCarritoLS() {
    if (productosCarritoLS.getItem('carrito') !== null) {
        carrito = JSON.parse(productosCarritoLS.getItem('carrito'));
    }
};

function verificoFormulario(){
    const formNombre = document.querySelector('#form-nombre').value;
    const formApellido = document.querySelector('#form-apellido').value;
    const formCorreo = document.querySelector('#form-correo').value;
    const formTelefono = document.getElementById('form-telefono').value;

    if (formNombre && formApellido && formCorreo && formTelefono){
        confirmaCompra();
    } else {
        Swal.fire({
            title: 'Complete correctamente los datos de contacto',
            icon: 'error',
        })
    }
};
function redireccionar(){window.location="../pages/productos.html";}


// Función main
const main = async () => {
    await getDBProductosJSON('../db/dbProductos.json');
    funUploadCarritoLS();
    funActCarrito();
};
main();
