var document, window;
var numbersLeft = 81, wrong = 0, draw = false, stop = false, hints;

function start_timer() {
    //Starts the timer. Makes it stop if pause is pressed. runs every second
    "use strict";
    var minutes = 0, seconds = 0, time, timer, adjusted, prev, newPrev, count = 0;
    //Creates a 5 second delay for user to examine board
    setTimeout(function() {
        timer = setInterval(function(){
            //If the game is not paused
            if (stop == false){
                //If the game isnt over increment seconds
                if (numbersLeft != 81) {
                    seconds++;
                    //Once seconds gets to 60 increment minutes and reset seconds 
                    if (seconds == 60) {
                        minutes++;
                        seconds = 0;
                    }
                    
                    time = minutes;
                    //make the time look like time if seconds is not two digits
                    if (seconds <= 9) {
                        time += (':0' + seconds);
                    } else {
                        time += (':' + seconds);
                    }
                    //change the count to the real time
                    document.getElementById('count').innerHTML = time;
                } else { //If the game is finished 
                    //The true seconds of the game with 10 seconds docked per wrong answer
                    prev = seconds + (wrong * 10);
                    //Increments minutes for every minute that the seconds added 
                    while (prev >= 60) {
                        count +=1; 
                        prev -= 60;
                    }
                    //Make it look like time if seconds is less than 9
                    if (prev <= 9) {
                        newPrev = '0' + String(prev);
                    } else {
                        newPrev = String(prev);
                    }
                    adjusted = String(minutes + count) + ':' + newPrev;
                    //stop timer
                    clearInterval(timer);
                    //tell user what their final time is
                    document.getElementById('time').innerHTML = "you got " + time + " with " + wrong + " mistakes giving you a total time of " + adjusted;
                }
            } 
        }, 1000);
    }, 5000);

}

function pause() {
    //Pauses the timer and makes the grid invisible. Or starts the timer 
    if (stop == false) {
        //once pressed changes stop and makes grid non clickable and invisibru
        stop = true;
        document.getElementById("grid").style.opacity = 0;
        document.getElementById("grid").style.pointerEvents = "none";
    } else {
        //makes grid visibru and clickable 
        stop = false;
        document.getElementById("grid").style.opacity = 1;
        document.getElementById("grid").style.pointerEvents = "auto";
    }
    
}

function change(dif) {
    //Starts the game by making the game grid appear and the main screen disappear. 
    "use strict";
    var x;
    //Takes off the main screen making it invisibru and nonclickable. Makes grid and pause button visibru and clickable. Creates and removes numbers from grid. checks to see how many are left and starts timer. 
    document.getElementById('grid').style.opacity = 1;
    document.getElementById('main').style.opacity = 0;
    document.getElementById('main').style.pointerEvents = "none";
    document.getElementById('grid').style.pointerEvents = "auto";
    document.getElementById("pause").style.opacity = 1;
    document.getElementById("pause").style.pointerEvents = "auto";
    main();
    remove_numbers(dif);
    for (x = 1; x < 10; x++) {
        check_num(x);
    }
    start_timer();
}

function restart(){
    //Resets evrything back to its initial state. Does this when user clicks try again 
    "use strict";
    var i;
    //Makes gameOver screen invisibru and nonclickable and makes the main screen visibru and clickable. Resets wrong and makes all the numbers visibru. 
    document.getElementById('gameOver').style.opacity = 0;
    document.getElementById('gameOver').style.pointerEvents = "none";
    document.getElementById('main').style.opacity = 1;
    document.getElementById('main').style.pointerEvents = "auto";
    document.getElementById('wrong').innerHTML = "0";
    document.getElementById('count').innerHTML = "(0:00)";
    for (i = 1; i < 10; i++) {
        document.getElementById("num" + String(i)).style.opacity = 1;
        document.getElementById("num" + String(i)).style.pointerEvents = "auto";
    }
    numbersLeft = 81;
    wrong = 0;
    unhighlight();
}

function highlight(name){
    //Highlights the box that is clicked on either red or green depending on if it is solved or not.  Happens when you click a box 
    "use strict";
    var temp, hold;
    //temp will be the opacity value of the name. 
    hold = document.getElementById(name.toLowerCase());
    temp = window.getComputedStyle(hold).getPropertyValue('opacity');
    //If the box is not solved unhighlight everything and highlight this box in red
    if (temp != 1) {
        unhighlight()
        document.getElementById(name).style.outline = "red solid 2px";
        document.getElementById(name).style.outlineStyle = "inset";
    }
    else{
        //this means that the box is solved so highlight all of the same numbers in green. 
        unhighlight();
        highlight_all(name);

    }
}

function highlight_all(name) {
    //Highlights all the same numbers on the board that are visible green.
    var x, y, id, hold, hold2, temp2;
    //Hold is the number of the box clicked. 
    hold = document.getElementById(name.toLowerCase());
    //Goes through all the boxes and if they are solved and the same number highlights them green. 
    for (x = 0; x < 9; x++) {
        id = id_getter(x).toUpperCase();
       for (y = 1; y < 10; y++) {
           id += String(y); 
           hold2 = document.getElementById(id.toLowerCase());
           temp2 = window.getComputedStyle(hold2).getPropertyValue('opacity');
           //If they are the same numbers and temp2 is solved then highlight. 
           if (hold.innerHTML == hold2.innerHTML && temp2 != 0){
               document.getElementById(id).style.outline = "green solid 3px";
               document.getElementById(id).style.outlineStyle = "inset";
           }
           //Reset id to the first letter
           id = id[0];
       }
   } 
}

function unhighlight(){
    //Unhighlights anything that is highlighted
    "use strict";
    var x, y, temp, hold, temp2;
    //Goes through the entire board and unhighlights everything that is highlighted. 
    for (x = 0; x < 9; x++) {
        temp = id_getter(x).toUpperCase();
        for (y = 1; y < 10; y++) {
            temp += String(y);
            hold = document.getElementById(temp);
            temp2 = window.getComputedStyle(hold).getPropertyValue("outline");
            //If temp2 is highlighted red or green reset outline to none.
            if (temp2 == 'rgb(255, 0, 0) inset 2px' || temp2 == 'rgb(0, 128, 0) inset 3px'){
                hold.style.outline = "none";
            }
            temp = temp[0];
        }
    }
}

function place_num(num) {
    //either writes in potential numbers or places a number in a box. Checks to see if the game is won or not. Also checks to see if the guess was wrong. 
    "use strict";
    var name, temp, temp2, hold, id, name2;
    //If the user is not trying to place possible numbers. 
    if (draw == false) {
        //Name will be the id of the box that is highlighted red. If nothing is highlighted red, name will be false 
        name = get_id();
        //if name is not false. 
        if (name != false) {
            name = name.toLowerCase();
            temp = document.getElementById(name);
            temp2 = window.getComputedStyle(temp).getPropertyValue("opacity");
            //If the box is not solved which it should be since it is highlighted red.!!!!! CHECK LATER FOR EFFICIENCY THIS IF IS REDUNDANT!!!!!!!
            if (temp2 != 1) {
                //hold is the number of the box
                hold = temp.innerHTML;
                //If hold is the same as the number pressed 
                if (hold == num){
                    name2 = String(name[0]) + String(name[0]) + String(name[1])
                    document.getElementById(name).style.opacity = 1;
                    //sees if all 9 of this number are on the board 
                    check_num(num);
                    unhighlight();
                    //resets the guessed numbers to show nothing 
                    document.getElementById(name2).innerHTML = '';
                    //takes away all of the numbers that the user thinks are possible in row, column, and box for convenience. 
                    remove_row(name2, num);
                    remove_column(name2, num);
                    remove_box(name2, num);
                    //Increments numbersLeft because they solved one. 
                    numbersLeft += 1;
                    //If the game is finished pull up game over text and make it clickable while making the pause and grid invisibru and nonclickable 
                    if (numbersLeft == 81) {
                        
                        document.getElementById('gameOver').style.opacity = 1;

                        document.getElementById('gameOver').style.pointerEvents = "auto";
                        document.getElementById('grid').style.opacity = 0;
                        document.getElementById('grid').style.pointerEvents = "none";
                        document.getElementById("pause").style.opacity = 0;
                        document.getElementById("pause").style.pointerEvents = "none";
                    }
                    //Highlights all of the same numbers 
                    highlight_all(name.toUpperCase());
                }
                //If the number guessed is not correct increment wrong count and briefly show the youre wrong message on screen.
                else {
                    wrong += 1;
                    document.getElementById('wrong').innerHTML = wrong;
                    document.getElementById('wrongError').style.opacity = 1;
                   setTimeout(function() {
                              document.getElementById('wrongError').style.opacity = 0;
                    }, 1000); 
                }
            }
        }
    } else { //If the user is trying to place in numbers they think it might be. 
        //places or removes potential numbers
        id = get_id();
        //if something is highlighted 
        if (id != false) {
            id = id.toLowerCase();
            id = String(id[0]) + String(id[0]) + String(id[1]);
            //Either place or remove a number they want. 
            remove_letters(id, num, true);
        }
        
    }
}

function remove_letters(id, num, add) {
    //Either places or removes a number into their list of possible numbers for a certain box. Add is a boolean that determines if I wanted it to add numbers or just remove them. 
    
    var in_string = false, i, new_s;
    //Checks to see if num is already in the numbers they think is possible. If it is sets in_string to true 
    for (i = 0; i < document.getElementById(id).innerHTML.length; i++){
        if (document.getElementById(id).innerHTML[i] == num) {
            in_string = true;
        }
    }
    
    //If the number they clicked is already in the string remove it and display the new string 
    if (in_string == true) {
       new_s = document.getElementById(id).innerHTML.replace(num, '');
        document.getElementById(id).innerHTML = new_s;
    } else if (in_string == false && add == true){  //If it is not and add is true meaning that I want this function to add numbers to what they guessed then add the number.
        document.getElementById(id).innerHTML += (num  + ' ');
    }
}

function remove_row(id, num) {
    //This is called once the user gets something correct. This function will look at the row of what the user pressed and take out the number they guessed in all the row if they placed it as a possible number in the row. 
    var new_id, i, hold;
    //Just used for simplicity. 
    hold = id.slice(0, 2);
    new_id = hold;
    //Iterates over every id in the row. Calls remove numbers with a false boolean beucase i dont want it to add numbers if it doesnt appear in other ids. 
    for (i = 1; i < 10; i++) {
        new_id += String(i);
        remove_letters(new_id, num, false);
        new_id = hold;
    }
}

function remove_column(id, num) {
    //This is called once the user gets something correct. This function will look at the column of what the user pressed and take out the number they guessed in all the column if they placed it as a possible number in the colunm. 
    var new_id, i, hold;
    //used to keep track of what index we are checking in the column
    hold = String(id[2]);
    //Iterates over all ids in that column. Calls remove numbers with a false boolean beucase i dont want it to add numbers if it doesnt appear in other ids. 
    for (i = 0; i < 9; i++){
        //Calls id_getter to get the proper id 
        new_id = id_getter(i);
        new_id = new_id[0] + new_id[0] + hold;
        remove_letters(new_id, num, false);
        new_id = '';
    }
}

function remove_box(id, num) {
    //This is called once the user gets something correct. This function will look at the box of what the user pressed and take out the number they guessed in all the box if they placed it as a possible number in the box. 
    var new_id, i, hold, x, y, startx, stopx;
    //looks at the number of the id to know what box we are looking at 
    i = id[2]
    //Used to help look at what box we are looking at 
    hold = id.slice(0, 2);
    //if it is in the places 1-3
    if (i % 9 < 3) {
        startx = 1;
        stopx = 4;
    } else if ((i % 9 > 3) && (i % 9 < 7)) { //if it is in the places 4-6 
        startx = 4;
        stopx = 7;
    } else { //if it is in the places 7-9
        startx = 7;
        stopx = 10;
    }

    for (x = 0; x < 3; x++) {
        //If the original box pushed has the id 'aa' 'bb' or 'cc'
        if (hold == 'aa' || hold == 'bb' || hold == 'cc') {
            //iterates over every id to check the box 
            if (x == 0) {
                new_id = 'aa'
            } else if (x == 1) {
                new_id = 'bb'
            } else {
                new_id = 'cc'
            }
            //If the original box has the id 'dd' 'ee' 'ff'
        } else if (hold == 'dd' || hold == 'ee' || hold == 'ff') {
            //Iterates over every id to check the box 
            if (x == 0) {
                new_id = 'dd'
            } else if (x == 1) {
                new_id = 'ee'
            } else {
                new_id = 'ff'
            }
            //If the original box has the id 'gg' 'hh' or 'ii'
        } else if (hold == 'gg' || hold == 'hh' || hold == 'ii') {
            //iterates over every id to check the box 
            if (x == 0) {
                new_id = 'gg'
            } else if (x == 1) {
                new_id = 'hh'
            } else {
                new_id = 'ii'
            }
        }
        //iterates over the proper numbers to check the ids. 
        for (y = startx; y < stopx; y++) {
            new_id += String(y);
            remove_letters(new_id, num, false);
            new_id = new_id.slice(0, 2);
        }
    }
    
    
}

function get_id(){
    //Gets the id of the box that is highlighted. returns it if its there if not returns false. 
    "use strict";
    var x, y, temp, temp2, hold;
    //Iterates over every box to look for the one that is outlined in red.
    for (x = 0; x < 9; x++) {
        temp = id_getter(x).toUpperCase();
        for (y = 1; y < 10; y++) {
            temp += String(y);
            hold = document.getElementById(temp);
            temp2 = window.getComputedStyle(hold).getPropertyValue("outline");
            if (temp2 == 'rgb(255, 0, 0) inset 2px'){
                return temp;
            }
            temp = temp[0];
        }
    }
    return false;
}

function check_num(num){
    //checks to see how many times num appears on the grid. If its nine makes the opacity of that number on the bottom 0.
    "use strict";
    var i, j, id, count = 0, hold, temp;
    //Iterates over every box to look for how many times the number appears solved on the board. 
    for (i = 0; i < 9; i++) {
        id = id_getter(i);
        for (j = 1; j < 10; j++){
            id +=  String(j);
            hold = document.getElementById(id);
            temp = window.getComputedStyle(hold).getPropertyValue("opacity");
            if (hold.innerHTML == num && temp == 1) {
                count += 1;
            }
            id = id[0]
        }
    }
    //If it appears all nine times then make it invisibru and nonclickable. 
    if (count == 9) {
        document.getElementById("num" + String(num)).style.opacity = 0;
        document.getElementById("num" + String(num)).style.pointerEvents = "none";
    }
}

function write_nums(){
    //Used to write in numbers
    "use strict";
    //If draw is false set it to true to let other functions know the user is trying to write in numbers they think is possible. Also make an animation to let user know something different is going on. 
    if (draw == false) {
        draw = true;
        document.getElementById('num').style.opacity = .5;
    } else { // pencil is clicked again so change draw and change numbers back to normal 
        draw = false;
        document.getElementById('num').style.opacity = 1;
        //reset everything to normal
    }
}

function is_perfect(solved) {
    "use strict";
    //Used in backtracking to check to see if the board is randomized. Once all -1s are gone this means that it is because it is already checked by check_all
    var x, y;
    //Iterates over everything in the array and checks to see if all the numbers are not -1 which is what I initialized them as when creating the array. 
    for (x = 0; x < solved.length; x++) {
        for (y = 0; y < solved.length; y++) {
            if (solved[x][y] == -1) {
                return false;
            }
        }
    }
    return true;
}

function check_row(solved, i, j) {
    //Checks the row to see if the number is already there. returns true if there are no repeating numbers in the row. False if not. 
    "use strict";
    var x;
    //Iterates over every number in the row skips the index we are looking at. 
    for (x = 0; x < solved[i].length; x++) {
        if (solved[i][x] == solved[i][j] && (x != j)) {
            return false;
        }
    }
    return true;
}

function check_column(solved, i, j) {
    //Checks the column to see if the number is already there. Returns true is there is not a repeating number false if not. 
    "use strict";
    var x;
    //Iterates over everything in the column, skips the index we are looking at. 
    for (x = 0; x < solved.length; x++) {
        if (solved[x][j] == solved[i][j] && (x != i)) {
            return false;
        }
    }
    return true;
}

function check_box(solved, i, j) {
    //Checks the box to see if the number is already there. returns true if unique false if not, 
    "use strict";
    var startx, stopx, starty, stopy, x, y;
    //if it is at the beginng of what i called a box then set startx to i and stopx to i + 3
    if (i % 3 == 0) {
        startx = i;
        stopx = i + 3;
    //if it is in the middle of what i called a box then set startx to i-1 and stopx to i + 2
    } else if (i % 3 == 1) {
        startx = i - 1;
        stopx = i + 2;
    //If it is at the end of what i called a box set startx to i-2 and stopx to i+1
    } else {
        startx = i - 2;
        stopx = i + 1;
    }
    
    
    if (j % 9 < 3) {
        starty = 0;
        stopy = 3;
    } else if ((j % 9 > 2) && (j % 9 < 6)) {
        starty = 3;
        stopy = 6;
    } else {
        starty = 6;
        stopy = 9;
    }
    //iterates over the entire box skipping the index in question to see if the number is unique. 
    for (x = startx; x < stopx; x++) {
        for (y = starty; y < stopy; y++) {
            if ((solved[x][y] == solved[i][j]) && (x != i && y != j)) {
                return false;
            }
        }
    }
    return true;
    
}

function is_right(solved, i, j) {
    //Method for simplicity that calls everything to see if there is another number in the area.
    "use strict";
    return ((check_row(solved, i, j)) && (check_column(solved, i, j)) && (check_box(solved, i, j)));
    
}

function find_next(solved) {
    //Finds the next open space on the grid. Used in backtracking algorithm
    "use strict";
    var i, j;
    //iterates over the array to find the next value that is -1 returning the index as a list. 
    for (i = 0; i < solved.length; i++) {
        for (j = 0; j < solved.length; j++) {
            if (solved[i][j] == -1) {
                return [i, j];
            }
        }
    }
}

function shuffle(a) {
    //Randomizes a list
    "use strict";
    var j, x, i;
    for (i = a.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function number_generator(solved) {
    //The backtracking algorithm to generate the board.
    "use strict";
    //base case. If there are no more -1s return true. 
    if (is_perfect(solved)) {
        return true;
    } else {
        var temp, right, i, j;
        //temp is now a list of the index of the next index in the array that is -1. 
        temp = find_next(solved);
        //right will be a list of all the possible numbers that can be in the current spot. 
        right = [];
        for (i = 1; i < 10; i++) {
            solved[temp[0]][temp[1]] = i;
            if (is_right(solved, temp[0], temp[1]) ) {
                right.push(i);
            }
        }
        //mixes right up to maintain randomness. 
        right = shuffle(right);
        //iterates over right and recursively calls number_generator until it finds the solution
        for (j = 0; j < right.length; j++) {
            solved[temp[0]][temp[1]] = right[j];
            if (number_generator(solved)) {
                return true;
            }
        }
        //undoes what we just did
        solved[temp[0]][temp[1]] = -1;
    }
    return false;
}

function remove_numbers(dif) {
    //This function removes a set amount of numbers from the grid according to the difficulty of the game.
    
    "use strict";
    var num, i = 0, x, y, temp, temp2, hold;
    //Depending on the difficulty removes a set amount of numbers. 
    if (dif == "easy") {
        num = 43;
        hints  = 3;
    } else if (dif == "med") {
        num = 51;
        hints = 2;
    } else {
        num = 54;
        hints = 1;
    }
    //takes away the set amount of numbers from numbers left.
    document.getElementById("hints").innerHTML = hints;
    numbersLeft -= num;
    
    //randomly gets ids of boxes and makes them invisibru.  Does this number amounts of time
    while (i < num) {
        x = Math.floor(Math.random() * 9);
        y = Math.floor(Math.random() * 9 + 1);
        temp = id_getter(x-1)
        temp += String(y);
        hold = document.getElementById(temp);
        temp2 = window.getComputedStyle(hold).getPropertyValue("opacity");
        //if the box is not yet removed then remove it and increment i. 
        if (temp2 == 1) {
            document.getElementById(temp).style.opacity = 0;
            i += 1;
        }
        temp = '';
    }
}

function give_hint() {
    var id;
    if (hints > 0) {
        id = get_id();
        if (id != false) {
            place_num(document.getElementById(id.toLowerCase()).innerHTML);
            hints -= 1;
            document.getElementById("hints").innerHTML = hints;
        }
    }
}

function show_grid(solved) {
    "use strict";
    var x, y, temp2;
    for (x = 0; x < solved.length; x++) {
        temp2 = id_getter(x)
        for (y = 0; y < solved.length; y++) {
            temp2 += String(y + 1);
            document.getElementById(temp2).innerHTML = (String(solved[x][y]));
            temp2 = temp2[0];
        }
    }
}


function id_getter(x) {
    //helper function to get the first letter of an id given the x. returns that letter
    var temp;
    if (x == 0) {
        temp = 'a';
    } else if (x == 1) {
        temp = 'b';
    } else if (x == 2) {
        temp = 'c';
    } else if (x == 3) {
        temp = 'd';
    } else if (x == 4) {
        temp = 'e';
    } else if (x == 5) {
        temp = 'f';
    } else if (x == 6) {
        temp = 'g';
    } else if (x == 7) {
        temp = 'h';
    } else {
        temp = 'i';
    }
    return temp;
}

function screen_checker(){
    //checks the width of the screen to get a good width for the box !!! CHANGE THIS LATER!!!
    var i, j, id;
    setInterval(function() {
        for (i = 0; i < 9; i++) {
            id = id_getter(i);
            id = id.toUpperCase();
            for (j = 1; j < 10; j++) {
                id += String(j)

                if (window.innerWidth > 1050) {
                    document.getElementById(id).style.width = "33%";
                } else if (window.innerWidth > 1050 && window.innerwidth > 810) {
                    document.getElementById(id).style.width = "32.95%"
                } else {
                    document.getElementById(id).style.width = "32.8%";
                }
                id = id[0];
            }
        }
    }, 200)
}

function main() {
    //Creates the main array and generates the array with random numbers. Shows grid and checks screen. 
    "use strict";
    var solved = [], i, j, temp;
    for (i = 0; i < 9; i++) {
        temp = [];
        for (j = 0; j < 9; j++) {
            temp.push(-1);
        }
        solved.push(temp);
    }
    number_generator(solved);
    show_grid(solved);
    screen_checker();
}
