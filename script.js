// Basic interactivity for envelope, gallery, lightbox, music, and confetti
document.addEventListener('DOMContentLoaded', () => {
  const envelope = document.getElementById('envelope');
  const bgMusic = document.getElementById('bg-music');
  const confettiCanvas = document.getElementById('confetti-canvas');

  function tryPlayMusic() {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(()=> {}).catch((e)=> { console.log('Autoplay prevented:', e); });
    }
  }
  tryPlayMusic();

  envelope.addEventListener('click', openLetter);
  envelope.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') openLetter(); });

  function openLetter() {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    runConfetti();
    tryPlayMusic();
  }

  const galleryGrid = document.getElementById('gallery-grid');
  const photos = [];
  (function loadPhotos(){
    const manifest = window.__PHOTO_MANIFEST || [];
    manifest.forEach((p, idx) => {
      const img = document.createElement('img');
      img.src = p;
      img.alt = 'Temmy photo ' + (idx+1);
      img.loading = 'lazy';
      img.dataset.index = idx;
      img.addEventListener('click', () => openLightbox(idx));
      galleryGrid.appendChild(img);
      photos.push(p);
    });
  })();

  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  let current = 0;
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('prev-btn').addEventListener('click', ()=> show(current-1));
  document.getElementById('next-btn').addEventListener('click', ()=> show(current+1));
  lightbox.addEventListener('click', (e)=>{ if (e.target === lightbox) closeLightbox(); });

  function openLightbox(i){
    current = i;
    lbImg.src = photos[current];
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden','false');
  }
  function closeLightbox(){
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden','true');
  }
  function show(i){
    if (i < 0) i = photos.length -1;
    if (i >= photos.length) i = 0;
    current = i;
    lbImg.src = photos[current];
  }

  function runConfetti(){
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    const pieces = [];
    const colors = ['#f8c6d1','#f6a6b7','#ffd8e0','#d977a1','#d4af7f'];
    for (let i=0;i<120;i++){
      pieces.push({
        x: Math.random()*w,
        y: Math.random()*-h,
        r: (Math.random()*8)+4,
        d: Math.random()*w,
        color: colors[Math.floor(Math.random()*colors.length)],
        tilt: Math.floor(Math.random()*10)-10,
        tiltAngleIncremental: (Math.random()*0.07)+0.05,
        tiltAngle:0
      });
    }
    let angle=0;
    function draw(){
      ctx.clearRect(0,0,w,h);
      for(let i=0;i<pieces.length;i++){
        const p=pieces[i];
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(angle + p.d) + 3 + p.r/2)/2;
        p.x += Math.sin(angle);
        p.tilt = Math.sin(p.tiltAngle) * 12;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x + p.tilt, p.y, p.r, p.r*0.6);
        ctx.closePath();
      }
      angle += 0.01;
      requestAnimationFrame(draw);
    }
    draw();
    setTimeout(()=>{ ctx.clearRect(0,0,w,h); }, 6000);
  }

  window.addEventListener('resize', ()=> {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  });

});
