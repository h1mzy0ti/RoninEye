import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const navLinks = document.querySelector(".nav-links")
  const authButtons = document.querySelector(".auth-buttons")

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      this.classList.toggle("active")

      if (navLinks.style.display === "flex") {
        navLinks.style.display = "none"
        authButtons.style.display = "none"
      } else {
        navLinks.style.display = "flex"
        navLinks.style.flexDirection = "column"
        navLinks.style.position = "absolute"
        navLinks.style.top = "80px"
        navLinks.style.left = "0"
        navLinks.style.width = "100%"
        navLinks.style.backgroundColor = "white"
        navLinks.style.padding = "1rem"
        navLinks.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        navLinks.style.zIndex = "100"

        authButtons.style.display = "flex"
        authButtons.style.flexDirection = "column"
        authButtons.style.position = "absolute"
        authButtons.style.top = `${80 + navLinks.offsetHeight}px`
        authButtons.style.left = "0"
        authButtons.style.width = "100%"
        authButtons.style.backgroundColor = "white"
        authButtons.style.padding = "1rem"
        authButtons.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        authButtons.style.zIndex = "100"
      }
    })
  }

  // Contact form submission
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const message = document.getElementById("message").value

      // Simple validation
      if (!name || !email || !message) {
        alert("Please fill in all fields")
        return
      }

      // Here you would typically send the form data to a server
      // For demo purposes, we'll just show an alert
      alert(`Thank you for your message, ${name}! We'll get back to you soon.`)

      // Reset form
      contactForm.reset()
    })
  }

  // Initialize charts
  const responseTimeCtx = document.getElementById("responseTimeChart")
  if (responseTimeCtx) {
    const responseTimeChart = new Chart(responseTimeCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Response Time (ms)",
            data: [150, 140, 160, 130, 120, 125, 124],
            borderColor: "#4f46e5",
            backgroundColor: "rgba(79, 70, 229, 0.1)",
            tension: 0.3,
            borderWidth: 2,
            pointBackgroundColor: "#4f46e5",
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
        },
      },
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        })
      }
    })
  })

  // Animation on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".feature-card, .about-content, .contact-content")

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementPosition < windowHeight - 100) {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }
    })
  }

  // Set initial state for animations
  document.querySelectorAll(".feature-card, .about-content, .contact-content").forEach((element) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(20px)"
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease"
  })

  // Run animation on load and scroll
  window.addEventListener("load", animateOnScroll)
  window.addEventListener("scroll", animateOnScroll)
})
