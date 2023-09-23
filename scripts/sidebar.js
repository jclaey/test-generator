const instructionsBtn = document.querySelector('#instructions-btn')
const sidebar = document.querySelector('#instructions')
const closeBtn = document.querySelector('#close-btn')

const openSidebar = () => {
    document.body.classList.toggle('open-sidebar')
}

const closeSidebar = () => {
    document.body.classList.toggle('open-sidebar')
}

instructionsBtn.addEventListener('click', openSidebar)
closeBtn.addEventListener('click', closeSidebar)