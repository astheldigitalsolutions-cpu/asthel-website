// ============================================
// ASTHEL GROUP — 3D + ANIMATIONS
// ============================================

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ===== MOBILE MENU =====
function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}

// ===== 3D HERO — THREE.JS =====
function initHero3D() {
  if (window.innerWidth < 900) return; // skip on mobile
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('hero-canvas');
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Wireframe globe
  const globeGeo = new THREE.IcosahedronGeometry(2.4, 2);
  const globeMat = new THREE.MeshBasicMaterial({
    color: 0xD4AF37, wireframe: true, transparent: true, opacity: 0.35
  });
  const globe = new THREE.Mesh(globeGeo, globeMat);
  scene.add(globe);

  // Inner glow sphere
  const innerGeo = new THREE.SphereGeometry(1.9, 32, 32);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x12294A, transparent: true, opacity: 0.4
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  scene.add(inner);

  // Particles (data streams)
  const particleCount = 400;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 30;
  }
  const particlesGeo = new THREE.BufferGeometry();
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({
    color: 0xF4D77A, size: 0.04, transparent: true, opacity: 0.7
  });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
  });

  // Animation loop
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.0005;

    globe.rotation.y = t + mouseX;
    globe.rotation.x = mouseY;
    inner.rotation.y = -t * 0.5;

    particles.rotation.y = t * 0.3;
    particles.rotation.x = t * 0.1;

    // scroll parallax
    camera.position.z = 8 + scrollY * 0.005;
    camera.position.y = -scrollY * 0.003;

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Start 3D when Three.js ready
if (typeof THREE !== 'undefined') {
  initHero3D();
}

// ===== SCROLL REVEAL (simple) =====
const observerOptions = { threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.biz-card, .about-card, .section-head').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s, transform 0.7s';
  observer.observe(el);
});

// ===== CONTACT FORM =====
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Since no backend yet, redirect to mailto as fallback
  setTimeout(() => {
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const subject = e.target.querySelectorAll('input[type="text"]')[1].value;
    const message = e.target.querySelector('textarea').value;

    const mailBody = `Name: ${name}%0AEmail: ${email}%0A%0AMessage:%0A${message}`;
    window.location.href = `mailto:astheldigitalsolutions@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailBody}`;

    btn.textContent = '✓ Opening Email...';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      e.target.reset();
    }, 2000);
  }, 600);
}