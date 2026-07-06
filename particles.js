class CinematicUniverse {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.handleResize();
        this.handleMouse();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles = [];
        
        // Calculate number of particles based on screen size (keeps it sparse and elegant)
        const numParticles = (this.canvas.width * this.canvas.height) / 15000;
        
        for (let i = 0; i < numParticles; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            // Extremely slow, fluid movement
            const dx = (Math.random() - 0.5) * 0.3;
            const dy = (Math.random() - 0.5) * 0.3;
            // Very small particles
            const size = Math.random() * 1.5;
            this.particles.push(new Particle(this, x, y, dx, dy, size));
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.init();
        });
    }

    handleMouse() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
            
            // 3D Parallax effect on the main card
            const wrapper = document.querySelector('.parallax-wrapper');
            if (wrapper) {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
                wrapper.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            }
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
            const wrapper = document.querySelector('.parallax-wrapper');
            if (wrapper) {
                wrapper.style.transform = `rotateY(0deg) rotateX(0deg)`;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        // Slight trail effect for cinematic feel
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw();
        }
        this.connectParticles();
    }

    connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                let distance = ((this.particles[a].x - this.particles[b].x) * (this.particles[a].x - this.particles[b].x))
                    + ((this.particles[a].y - this.particles[b].y) * (this.particles[a].y - this.particles[b].y));
                
                if (distance < (this.canvas.width / 10) * (this.canvas.height / 10)) {
                    // Extremely subtle, razor-thin lines
                    opacityValue = 1 - (distance / 15000);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacityValue * 0.15})`; // Soft Indigo glow
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(universe, x, y, dx, dy, size) {
        this.universe = universe;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.baseX = this.x;
        this.baseY = this.y;
    }

    draw() {
        this.universe.ctx.beginPath();
        this.universe.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        this.universe.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.universe.ctx.fill();
    }

    update() {
        // Boundary check
        if (this.x > this.universe.canvas.width || this.x < 0) this.dx = -this.dx;
        if (this.y > this.universe.canvas.height || this.y < 0) this.dy = -this.dy;

        // Mouse interaction (gentle repulsion)
        if (this.universe.mouse.x != null) {
            let dx = this.universe.mouse.x - this.x;
            let dy = this.universe.mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.universe.mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (this.universe.mouse.radius - distance) / this.universe.mouse.radius;
                
                this.x -= forceDirectionX * force * 2;
                this.y -= forceDirectionY * force * 2;
            }
        }

        // Return to base position gently
        if (this.x !== this.baseX) {
            this.dx = this.x > this.baseX ? this.dx - 0.01 : this.dx + 0.01;
        }
        
        this.x += this.dx;
        this.y += this.dy;
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new CinematicUniverse();
});
