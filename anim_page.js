const expand_box_content = {
    anims_expand_box_inner: 
        {type: "horizontal",
        expanded: false}
};

function expandBoxActivate(button, box) {
    let button_obj = document.getElementById(button);
    let box_obj = document.getElementById(box);
    if (expand_box_content[box]["expanded"]) {
        expand_box_content[box]["expanded"] = false;
        box_obj.className = "expand_box_" + expand_box_content[box].type + "_text_inner closed";
        button_obj.classList.toggle("open");
        button_obj.classList.toggle("closed");
    } else {
        expand_box_content[box]["expanded"] = true;;
        box_obj.className = "expand_box_" + expand_box_content[box].type + "_text_inner opened";
        button_obj.classList.toggle("open");
        button_obj.classList.toggle("closed");
    }


}

document.getElementById("anims_button").addEventListener("click", function() {expandBoxActivate("anims_button", "anims_expand_box_inner");});