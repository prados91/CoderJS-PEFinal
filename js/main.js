// Constructor de objetos.
class Producto {
    constructor(id, nombre, imagen, precio, equipo) {
        this.id = id;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = parseFloat(precio);
        this.equipo = equipo;
    }
}
//leo db Local
const getDBProductosJSON = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    data.forEach((x) => productosTiendaBS.push(new Producto(x.id, x.nombre, x.imagen, x.precio, x.equipo)));
};
//Eventos
const productosItems = document.querySelector('#productos-items');
const productosCarrito = document.querySelector('#productos-carrito');
const productosPrecioTotal = document.querySelector('#productos-precio-total');
const productosVaciarCarrito = document.querySelector('#productos-btn-vaciar');
const productosComprarCarrito = document.querySelector('#productos-btn-comprar');
const productosCarritoLS = window.localStorage;


//Creación de arrays vacios para productos y carrito de compras
const productosTiendaBS = [];
let carrito = [];

//Evento de vaciado de carrito
productosVaciarCarrito.addEventListener('click', vaciarCarrito);

//Modifico DOM mediante JS para la estructura de productos.
function mostrarProductosDom(arr) {
    productosItems.innerHTML = "";
    let html;

    for (const item of arr) {
        const { id, nombre, imagen, precio } = item;
        html = `
		<div class="col-10 col-sm-6 col-md-4 col-xl-3 p-4 d-flex align-items-stretch">
			<div class="productos-card">
                <img src="../images/productos/${imagen}" alt="${nombre}" width="100%" class="img-fluid"/>
                <div class="productos-cardDatos">
                    <h5 class="card-title">${nombre}</h5>
                    <p class="card-text">$${precio}</p>
                    <button onclick="agregarAlCarrito(${id});" class="btnAgregar"><i class="bi bi-cart"></i>  Agregar al carrito</button>                    
                </div>
			</div>
		</div>
		`;
        productosItems.innerHTML += html;
    }
};

//Agrego al carrito
function agregarAlCarrito(id) {
    carrito.push(id);
    funActCarrito();
    funSaveCarritoLS();

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
    productosCarrito.innerHTML = '';
    if (carrito && carrito.length > 0) {
        productosComprarCarrito.classList.remove('hidden');
        productosVaciarCarrito.classList.remove('hidden');
        let html;
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
                <button onclick="borrarItemCarrito(${miItem[0].id});" class="btnBorrar">X</button>
            </div>
            `;
            productosCarrito.innerHTML += html;
        });
    } else {
        productosComprarCarrito.classList.add('hidden');
        productosVaciarCarrito.classList.add('hidden');
        html = `
        <div class="info-cart-product">
			<div class=".productos-cardDatos">
                <h5>El carrito se encuentra vacío</h5>
			</div>
        </div>
        `;
        productosCarrito.innerHTML = html;
    }
    // Precio Total
    productosPrecioTotal.innerHTML = calcularTotal();
};

// Evento para borrar un elemento del carrito
function borrarItemCarrito(evento) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    // actualizamos HTML y LS
    funActCarrito();
    funSaveCarritoLS();

    Toastify({
        text: "El producto seleccionado se eliminó de tu carrito",
        duration: 3000,
        offset: { y: 120 },
        style: {
            background: "linear-gradient(to right, #DC0054, #DC6054)",
        },
    }).showToast();
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
function vaciarCarrito() {

    Swal.fire({
        title: '¿Desea vaciar el carrito de compras?',
        icon: 'question',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            funActCarrito();
            localStorage.clear();

            Toastify({
                text: "Usted ha vaciado el carrito",
                duration: 3000,
                offset: { y: 120 },
                style: {
                    background: "linear-gradient(to right, #DC0054, #DC6054)",
                },
            }).showToast();
        }
    })
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

function filtrarProductos(arr, filtro) {
    if (filtro != "todos" ) {
        let equipoFiltrado = arr.filter(array => array.equipo === filtro);
        mostrarProductosDom(equipoFiltrado)
    } else {
        mostrarProductosDom(arr)
    }
};

const filterBoston = document.getElementById("filter-bc");
filterBoston.onclick = () => {
    const filtro = "Boston";
    filterTodos.checked = false;
    filterBoston.checked = true;
    filterChicago.checked = false;
    filterLakers.checked = false;
    filterSpurs.checked = false;
    filterWarriors.checked = false;
    filtrarProductos(productosTiendaBS, filtro);
};
const filterChicago = document.getElementById("filter-cb");
filterChicago.onclick = () => {
    const filtro = "Chicago";
    filterTodos.checked = false;
    filterBoston.checked = false;
    filterChicago.checked = true;
    filterLakers.checked = false;
    filterSpurs.checked = false;
    filterWarriors.checked = false;
    filtrarProductos(productosTiendaBS, filtro);
};

const filterLakers = document.getElementById("filter-la");
filterLakers.onclick = () => {
    const filtro = "Lakers";
    filterTodos.checked = false;
    filterBoston.checked = false;
    filterChicago.checked = false;
    filterLakers.checked = true;
    filterSpurs.checked = false;
    filterWarriors.checked = false;
    filtrarProductos(productosTiendaBS, filtro);
};

const filterSpurs = document.getElementById("filter-sa");
filterSpurs.onclick = () => {
    const filtro = "Spurs";
    filterTodos.checked = false;
    filterBoston.checked = false;
    filterChicago.checked = false;
    filterLakers.checked = false;
    filterSpurs.checked = true;
    filterWarriors.checked = false;
    filtrarProductos(productosTiendaBS, filtro);
};

const filterWarriors = document.getElementById("filter-gs");
filterWarriors.onclick = () => {
    const filtro = "Warriors";
    filterTodos.checked = false;
    filterBoston.checked = false;
    filterChicago.checked = false;
    filterLakers.checked = false;
    filterSpurs.checked = false;
    filterWarriors.checked = true;
    filtrarProductos(productosTiendaBS, filtro);
};

const filterTodos = document.getElementById("filter-todos");
filterTodos.onclick = () => {
    const filtro = "todos";
    filterTodos.checked = true;
    filterBoston.checked = false;
    filterChicago.checked = false;
    filterLakers.checked = false;
    filterSpurs.checked = false;
    filterWarriors.checked = false;
    filtrarProductos(productosTiendaBS, filtro);
};



// Función main
const main = async () => {
    await getDBProductosJSON('../db/dbProductos.json');
    mostrarProductosDom(productosTiendaBS);
    funUploadCarritoLS();
    funActCarrito();
};
main();
