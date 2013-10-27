var scrollInterval;
var isMouseDown = false;

function BodyMouseDown()
{
	isMouseDown = true;
}

function BodyMouseUp()
{
	isMouseDown = false;
}

function MousOverLeft(e)
{
    clearInterval(scrollInterval);
	scrollInterval = setInterval('Scroll(-100);', 60);
}

function MousOverRight(e)
{
    clearInterval(scrollInterval);
	scrollInterval = setInterval('Scroll(100);', 60);
}

function Scroll(value)
{
	if (!isMouseDown)
		window.scrollBy(value,0);
}

function ScrollBoxMouseOut()
{
	clearInterval(scrollInterval);
}