const PAGES = ["zines", "prints", "about"];

const clearHash = () => {
	history.pushState('', document.title, window.location.pathname);
};

function scrollToTop() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
} 

const removeChildren = (parent) => {
	while (parent.lastChild) {
		parent.removeChild(parent.lastChild);
	}
};

const renderSection = (type) => {
	history.pushState('', document.title, window.location.pathname);
	document.querySelector("section.current").classList.remove("current");
	document.querySelector(`#${type}`).classList.add("current");
	setUpScrolling();
}

const addSpotlightImage = (id) => {
	let image = document.querySelector(`#${WORKS[id].type}-spotlight img`)
	image.src = WORKS[id].src;
	image.alt = WORKS[id].alt;
}

const addSpotlightCollection = (id) => {
	let container = document.querySelector(`#${WORKS[id].type}-spotlight div.images`);
	removeChildren(container);
	let work = WORKS[id];
	WORKS[id].images.forEach((image) => {
		let img = document.createElement("img");
		img.src = image.src;
		img.id = id;
		img.alt = image.alt;
		container.append(img);
	});
}

const renderSpotlight = (id) => {
	scrollToTop();
	console.log(id)
	const spotlightSelector = `#${WORKS[id].type}-spotlight`;
	if (WORKS[id].images) {
		addSpotlightCollection(id);
	} else {
		addSpotlightImage(id);
	}
	["title", "description", "date" ].forEach((attr) => {
		document.querySelector(`${spotlightSelector} .${attr}`).innerText = WORKS[id][attr];
	});
	document.querySelector("section.current").classList.remove("current");
	document.querySelector(spotlightSelector).classList.add("current");
	document.querySelector(`${spotlightSelector} .back`).addEventListener("click", ()=>{
		document.querySelector(spotlightSelector).classList.remove("current");
		document.querySelector(`#${WORKS[id].type}`).classList.add("current");
	});
	setUpScrolling();
}

// Set up section scrolling for wide screens
const setUpScrolling = () => {
 const scrollHandler = (evt) => {
		if (window.getComputedStyle(evt.target).display !== "none") {
			let container = document.querySelector(`#${evt.target.parentElement.id}`);
			// To Do - make RTL friendly
			let offset = container.clientWidth;
			if (evt.target.classList.contains("back")) {
				offset = 0 - offset;
			}
			container.scrollTo({
				left: container.scrollLeft + offset,
				behavior: "smooth"
			});
		}
	};

	let scrolls = [ ...document.getElementsByClassName("scroll") ];
	scrolls.forEach(scroll => {
		scroll.removeEventListener("click", scrollHandler);
		scroll.addEventListener("click", scrollHandler);
	});
};

// Render images
for (const id in WORKS) {
	let work = WORKS[id];
	let section = document.querySelector(`#${work.type}`);
	let container = document.createElement("div");
	container.classList.add("image-item")
	section.append(container);
	let img = document.createElement("img");
	let textBox = document.createElement("div");
	img.src = work.src;
	img.id = id;
	img.alt = work.alt;
	container.append(img);
	textBox.innerText = work.title;
	textBox.classList.add("text-overlay");
	container.append(textBox);
};

// Handle clicks on navigation menu items
document.querySelectorAll("nav li").forEach((el) => {
	el.addEventListener('click', (event) => {
		document.querySelector("nav li.current").classList.remove("current");
		event.srcElement.classList.add("current");
		renderSection(event.srcElement.innerText.toLowerCase())
	})
});

// Handle clicks on preview images
document.querySelectorAll(".preview-images img").forEach((el) => {
	el.addEventListener('click', (event) => {
		renderSpotlight(event.srcElement.id);
	})
});

// Handle hashs links
if(window.location.hash) {
	const hash = window.location.hash.toLowerCase().substring(1);
	if (PAGES.includes(hash)) {
		renderSection(hash);
	} else if (Object.keys(WORKS).includes(hash)) {
		renderSpotlight(hash);
	}
	clearHash();
}

setUpScrolling();