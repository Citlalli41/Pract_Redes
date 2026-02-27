// Inicializar EmailJS
(function(){
  emailjs.init("kNnQqIhvRmz2kjVEP"); 
})();

const productos = [
  {
    id:1,
    nombre:"Maceta de cerámica",
    precio:250,
    desc:"Maceta decorativa de cerámica esmaltada en color blanco mate, tamaño 15 cm de alto x 18 cm de diámetro. Diseño geométrico moderno.",
    imgs:["img/producto1.jpg","img/producto1b.jpg"]
  },
  {
    id:2,
    nombre:"Lámpara minimalista",
    precio:1200,
    desc:"Lámpara colgante negra con detalles dorados, estructura metálica y diseño ondulado moderno. Largo de 80 cm.",
    imgs:["img/producto2.jpg","img/producto2b.jpg"]
  },
  {
    id:3,
    nombre:"Reloj de pared moderno",
    precio:800,
    desc:"Reloj metálico plateado de 40 cm de diámetro, estilo minimalista con números en relieve.",
    imgs:["img/producto3.jpg","img/producto3b.jpg"]
  },
  {
    id:4,
    nombre:"Set de velas aromáticas",
    precio:450,
    desc:"Set de tres velas aromáticas en frascos de vidrio en tonos blanco y azul claro. Altura 8 cm.",
    imgs:["img/producto4.jpg","img/producto4b.jpg"]
  },
  {
    id:5,
    nombre:"Cuadro abstracto",
    precio:1500,
    desc:"Cuadro decorativo en tonos negro, blanco, azul y dorado. Medidas 90 cm x 50 cm.",
    imgs:["img/producto5.jpg","img/producto5b.jpg"]
  },
  {
    id:6,
    nombre:"Alfombra decorativa",
    precio:2000,
    desc:"Alfombra rectangular 160 x 230 cm con patrones circulares en tonos neutros.",
    imgs:["img/producto6.jpg","img/producto6b.jpg"]
  },
  {
    id:7,
    nombre:"Espejo circular",
    precio:950,
    desc:"Espejo redondo de 60 cm con marco negro metálico delgado.",
    imgs:["img/producto7.jpg","img/producto7b.jpg"]
  },
  {
    id:8,
    nombre:"Planta artificial",
    precio:300,
    desc:"Planta artificial de 1.20 m de altura con hojas verdes realistas y maceta negra.",
    imgs:["img/producto8.jpg","img/producto8b.jpg"]
  },
  {
    id:9,
    nombre:"Cojines decorativos",
    precio:600,
    desc:"Set de dos cojines 45 x 45 cm en color blanco con hojas doradas.",
    imgs:["img/producto9.jpg","img/producto9b.jpg"]
  },
  {
    id:10,
    nombre:"Figura de madera",
    precio:700,
    desc:"Figura artesanal en forma de pato tallada en madera con acabado barnizado.",
    imgs:["img/producto10.jpg","img/producto10b.jpg"]
  }
];

// Renderizar productos
const contenedor = document.getElementById("productos");

productos.forEach(p => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="imagenes">
      ${p.imgs.map(img => `<img src="${img}" alt="${p.nombre}">`).join("")}
    </div>
    <h3>${p.nombre}</h3>
    <p>${p.desc}</p>
    <p><strong>$${p.precio}</strong></p>
    <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
  `;

  contenedor.appendChild(card);
});

// Efecto 3D en imágenes (DESPUÉS de renderizar)
document.querySelectorAll(".card img").forEach(img => {
  img.addEventListener("mousemove", e => {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const mitad = rect.width / 2;

    if(x > mitad){
      img.style.transform = "rotateY(40deg) scale(1.1)";
    } else {
      img.style.transform = "rotateY(-40deg) scale(1.1)";
    }
  });

  img.addEventListener("mouseleave", () => {
    img.style.transform = "rotateY(0deg) scale(1)";
  });
});

// Carrito
let carrito = [];
let codigoGenerado = null;

function agregarAlCarrito(id){
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  renderCarrito();
}

function eliminarDelCarrito(index){
  carrito.splice(index, 1);
  renderCarrito();
}

function renderCarrito(){
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((p, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.nombre} - $${p.precio}
      <button class="eliminar" onclick="eliminarDelCarrito(${index})">X</button>
    `;
    lista.appendChild(li);
    total += p.precio;
  });

  document.getElementById("total").textContent = `Total: $${total}`;
}

function finalizarCompra(){
  if(carrito.length === 0){
    alert("Tu carrito está vacío.");
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();

  if(!nombre || !correo){
    alert("Por favor ingresa tu nombre y correo.");
    return;
  }

  codigoGenerado = Math.floor(100000 + Math.random() * 900000);

  emailjs.send("service_cs46nha","template_6vkzl1o",{
    codigo: codigoGenerado,
    user_name: nombre,
    user_email: correo
  }).then(() => {
    alert(`Se envió un código de verificación al correo ${correo}.`);
  }).catch(err => console.error("Error código:", err));
}

function verificarCodigo(){
  const codigoIngresado = document.getElementById("codigoIngresado").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const fecha = new Date().toLocaleDateString();
  const total = carrito.reduce((acc,p) => acc + p.precio, 0);

  if(codigoIngresado == codigoGenerado){
    emailjs.send("service_cs46nha","template_xen9ueg",{
      user_name: nombre,
      user_email: correo,
      amount: total,
      date: fecha
    }).then(() => {
      alert(`Compra confirmada. Factura enviada a ${correo}.`);
      carrito = [];
      renderCarrito();
      codigoGenerado = null;
    }).catch(err => console.error("Error pedido:", err));
  } else {
    alert("El código ingresado no es correcto.");
  }
}