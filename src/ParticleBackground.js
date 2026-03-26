import React, { useRef, useEffect } from 'react';

const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // 设置 Canvas 为全屏
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // 粒子配置
        const particles = [];
        const particleCount = 100; // 粒子数量
        const connectionDistance = 120; // 连线距离
        const mouseConnectionDistance = 200; // 鼠标连线距离
        const mouse = { x: null, y: null };

        // 鼠标移动事件
        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // 粒子类
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5; // 粒子大小
                this.speedX = (Math.random() - 0.5) * 0.5; // X轴速度
                this.speedY = (Math.random() - 0.5) * 0.5; // Y轴速度
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // 边界碰撞检测
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
            }

            draw() {
                ctx.fillStyle = 'rgba(52, 211, 153, 0.6)'; //  emerald-400 with opacity
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.random() * Math.PI * 2);
                ctx.fill();
            }
        }

        // 初始化粒子
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // 绘制连线
        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // 粒子间连线
                    if (distance < connectionDistance) {
                        ctx.strokeStyle = `rgba(52, 211, 153, ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // 鼠标与粒子连线
                if (mouse.x && mouse.y) {
                    const dxMouse = particles[i].x - mouse.x;
                    const dyMouse = particles[i].y - mouse.y;
                    const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                    if (distMouse < mouseConnectionDistance) {
                        ctx.strokeStyle = `rgba(52, 211, 153, ${1 - distMouse / mouseConnectionDistance})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        // 动画循环
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLines();
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // 清理函数
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default ParticleBackground;