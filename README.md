# Personal Website File Repository

This repo is a temporary collection of pages which will be used for my personal website.  
[Here's a link to the GitHub Pages version of this repo](https://jakbern.github.io/website_stuff/)

## Various Pages
- [Landing page](/home.html)
- [Interactive JavaScript animations using the HTML5 canvas](/anim_page_template.html)
- [ASCII Map Editor](/map_viewer.html)

## Notes on webpages
Most webpages here are works in progress and do not have all funcitonality currently implemented. Some notes specific to each are below.

### Interactive Animations
Currently, only a lightning/node drawing animation is present. The expanding menu on the page will later allow the user to switch between animations.  
Double clicking will place a node. The node can then be dragged around the page with by holding left click over it. Double clicking on the node again will remove it.  
8 nodes can be created. Pressing the "z" key will toggle the lightning animation, which makes lightning (squiggly lines) arc between each node.

### ASCII Map Editor
This is work in progress project which allows the design and viewing of 128 x 128 maps of ASCII (and Unicode) characters for roguelike games.
Currently, the only working tools are the pencil, fill, and select.
The palette and tileset features are currently fully functional. An example tileset can be downloaded [here.](/default.tileset) Upload this file after clicking the "Load tileset" button to use it.
#### Notes on Changing Colors
The color currently being used for the background color of each tile or the character color can be changed by clicking on the "bg" or "ch" tiles under the "Using" bar on the left, after which they will become italicized. You can then change the color by clicking on a swatch on the palette or by using the "Set Color" button with the eyedropper tool on the right set or a hexcode (preceded by a hash) entered. Entering a hexcode overrides the eyedropper/color picker's choice. The "a" and "d" keys act as hotkeys for the background (bg) and character (ch) color selectors, respectively.
#### Notes on Custom Palettes
Custom swatches can be set when using the custom palette by ctrl + clicking on a swatch then using the "Set Color" button. Custom colors that are more than 1 space away from each other (horizontally or vertically) will have the color values of swatches between them linearly interpolated. Vertical distance is converted into horizontal distance as if the swatched were laid out in a 1D array going from left to right and top to bottom. These custom swatches are remembered until a new palette is loaded (or the page is refreshed).
#### Future Plans
- Complete the rest of the tools
- Add saving and loading maps
- Add more indications for hotkeys/instructions to the program's UI
