document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const clickableImage = document.getElementById('clickableImage');
    const sound1 = document.getElementById('sound1');
    const sound2 = document.getElementById('sound2');
    let isDragging = false;
    let randomImage; // Variable to store the random image
    let image2Shown = false; // Flag to track if image 2 is shown
    let offsetX, offsetY; // Store the offset

    // Preload your images here
    const image1 = new Image();
    image1.src = 'YourImage1.png'; // Replace with your image1 URL

    const image2 = new Image();
    image2.src = 'YourImage2.png'; // Replace with your image2 URL

    const randomImageSrc = 'RandomImage.png'; // Replace with your random image URL

    clickableImage.addEventListener('click', (event) => {
        if (!isDragging && !randomImage) { // Check if not dragging and no randomImage displayed
            // Generate random coordinates within the visible area of the container
            const containerRect = container.getBoundingClientRect();
            const randomX = Math.random() * (containerRect.width - 50); // Adjust 50 as needed
            const randomY = Math.random() * (containerRect.height - 50); // Adjust 50 as needed

            // Create a new random image
            randomImage = document.createElement('img');
            randomImage.id = 'randomImage';
            randomImage.src = randomImageSrc;
            randomImage.style.position = 'fixed'; // Set position as fixed
            randomImage.style.left = randomX + 'px';
            randomImage.style.top = randomY + 'px';
            randomImage.style.zIndex = '1000'; // Ensure it's on top

            container.appendChild(randomImage);

            // Offset is calculated when the mouse is clicked on the random image
            const rect = randomImage.getBoundingClientRect();
            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top;

            // Drag-and-drop event for the new image
            randomImage.addEventListener('mousedown', (e) => {
                isDragging = true;
                e.preventDefault(); // Prevent default drag-and-drop behavior
                e.stopPropagation();

                // Update the offset based on the cursor position within the random image
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                // Show image 2 when dragging starts
                if (!image2Shown) {
                    clickableImage.src = image2.src;
                    image2Shown = true;
                }
            });
        }
    });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(e) {
        if (isDragging) {
            // Calculate the new position based on the mouse pointer and the offset
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            randomImage.style.left = newX + 'px';
            randomImage.style.top = newY + 'px';
        }
    }

	function onMouseUp() {
		if (isDragging) {
			isDragging = false;

			// Get the position and dimensions of the random image
			const rect = randomImage.getBoundingClientRect();
			const randomImageLeft = rect.left;
			const randomImageRight = rect.right;
			const randomImageTop = rect.top;
			const randomImageBottom = rect.bottom;

			// Get the position and dimensions of the rectangle
			const rectangle = document.getElementById('coloredRectangle');
			const rectangleRect = rectangle.getBoundingClientRect();
			const rectangleLeft = rectangleRect.left;
			const rectangleRight = rectangleRect.right;
			const rectangleTop = rectangleRect.top;
			const rectangleBottom = rectangleRect.bottom;

			// Check if any part of the random image touches any part of the rectangle
			const randomImageTouchesRectangle =
				randomImageLeft <= rectangleRight &&
				randomImageRight >= rectangleLeft &&
				randomImageTop <= rectangleBottom &&
				randomImageBottom >= rectangleTop;

			// Play sound 1 if the random image touches the rectangle, otherwise play sound 2
			if (randomImageTouchesRectangle) {
				sound2.pause();
				sound1.currentTime = 0;
				sound1.play();
			} else {
				
				sound1.pause();
				sound2.currentTime = 0;
				sound2.play();
			}

			// Remove the random image
			container.removeChild(randomImage);

			// Change back to image1
			clickableImage.src = image1.src;
			image2Shown = false;

			// Reset variables
			randomImage = null;
			offsetX = offsetY = 0;
		}
	}
});