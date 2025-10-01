let selected = null;

const objects = document.querySelectorAll('.Object');
const Dropzones = document.querySelectorAll('.Dropzone');

// Select object
objects.forEach(obj => {
  obj.addEventListener('click', () => {
    // Clear old selection
    objects.forEach(o => o.classList.remove('selected'));

    // Select this one
    selected = obj;
    obj.classList.add('selected');
  });
});

// Place on Dropzone
Dropzones.forEach(zone => {
  zone.addEventListener('click', () => {
    if (!selected) return;

    if (zone.dataset.accept === selected.dataset.target) {
        // ✅ Correct
        selected.classList.remove('selected');

        // clone the object
        const clone = selected.cloneNode(true);
        clone.style.display = "block";
        clone.classList.remove("Object"); // prevent it from being draggable again
        

        // clear zone & reset styles
        zone.innerHTML = ""
        clone.style.width = "5vw";
        clone.style.height = "auto";

        // put object inside
        zone.appendChild(clone);

        // hide the original
        selected.style.display = "none";
        selected = null;

        // success colors
        zone.style.borderColor = "transparent";
        zone.style.background = "transparent";

        // Check if all objects are placed → confetti & message
        if (checkAllPlaced()) {
          createConfetti();
          const questionEl = document.getElementById("Question");
          if (questionEl) {
             questionEl.textContent = "Вы все нашли правильно!";
             questionEl.style.fontSize = "3rem";
          }
        }
        } else {
            // ❌ Wrong → shake and flash red
            const originalBorder = zone.style.borderColor;
            const originalBg = zone.style.background;

            zone.style.transition = "border-color 200ms, background 200ms";

            zone.style.borderColor = "red";
            zone.style.background = "hsl(0 100% 50% / 0.2)";
            zone.style.animation = "shake 0.3s";

            zone.addEventListener("animationend", () => {
                zone.style.animation = "";
                zone.style.borderColor = originalBorder;
                zone.style.background = originalBg;
            }, { once: true });
        }
  });
});

// Optional: deselect if clicking outside
document.addEventListener('click', e => {
  if (!e.target.classList.contains('Object')) {
    objects.forEach(o => o.classList.remove('selected'));
    selected = null;
  }
});

// Add shake animation dynamically
const style = document.createElement("style");
style.textContent = `
@keyframes shake {
  0% { transform: translate(-50%, -50%) translateX(0); }
  25% { transform: translate(-50%, -50%) translateX(-5px); }
  50% { transform: translate(-50%, -50%) translateX(5px); }
  75% { transform: translate(-50%, -50%) translateX(-5px); }
  100% { transform: translate(-50%, -50%) translateX(0); }
}`;
document.head.appendChild(style);

// ✅ Confetti Functions

function checkAllPlaced() {
  return [...objects].every(o => o.style.display === "none");
}

function createConfetti() {
  const colors = ["#f94144","#f3722c","#f9c74f","#90be6d","#577590"];
  const confettiCount = 100;

  for (let i = 0; i < confettiCount; i++) {
    const conf = document.createElement("div");
    conf.style.position = "fixed";
    conf.style.width = "10px";
    conf.style.height = "10px";
    conf.style.background = colors[Math.floor(Math.random() * colors.length)];
    conf.style.top = "50%";
    conf.style.left = "50%";
    conf.style.borderRadius = "50%";
    conf.style.pointerEvents = "none";
    conf.style.zIndex = 9999;

    const angle = Math.random() * 2 * Math.PI;
    const velocity = Math.random() * 10 + 5;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity;

    document.body.appendChild(conf);

    // Animate confetti
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    const gravity = 0.5;

    const anim = setInterval(() => {
      vy += gravity * 0.1; // simulate gravity
      x += vx;
      y += vy;
      conf.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random()*360}deg)`;
      if (y > window.innerHeight) {
        conf.remove();
        clearInterval(anim);
      }
    }, 16);
  }
}
