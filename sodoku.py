import random
import copy
from graphics import graphics

def is_perfect(solved):
    for i in range(len(solved)):
        for j in range(len(solved)):
            if solved[i][j] == -1:
            #if not is_right(solved, i, j):
                return False
    return True

def is_right(solved, i, j):
    return (check_row(solved, i, j) == True and
            check_box(solved, i, j)== True and
            check_column(solved, i, j) == True)

def check_row(solved, i, j):
    for x in range(len(solved[i])):
        if solved[i][x] == solved[i][j] and (x != j):
            return False
    return True
            
        

def check_column(solved, i , j):
    for x in range(len(solved)):
        if solved[x][j] == solved[i][j] and x != i:
            return False
    return True

def check_box(solved, i, j):
    if i % 3 == 0:
        startx = i
        stopx = i+3
    elif i % 3 == 1:
        startx = i-1
        stopx = i+2
    else:
        startx = i-2
        stopx = i+1
    if j % 9 < 3:
        starty = 0
        stopy = 3
    elif (j % 9 > 2) and (j % 9 < 6):
        starty = 3
        stopy = 6
    else:
        starty = 6
        stopy = 9

    for x in range(startx, stopx):
        for y in range(starty, stopy):
            if solved[x][y] == solved[i][j] and (x != i and y != j):
                return False
    return True

def find_next(solved):
    for i in range(len(solved)):
        for j in range(len(solved)):
            if solved[i][j] == -1:
                return i, j
                
        
    
def number_generator(solved):
    if is_perfect(solved):
        return True
    else:
        i, j = find_next(solved)
        right = []
        for k in range(1, 10):
            solved[i][j] = k
            if is_right(solved, i, j):
                right.append(k)
                
        right = random.sample(right, len(right))
        for l in range(len(right)):
            solved[i][j] = right[l]
            if number_generator(solved):
                return True
        solved[i][j] = -1                   
    return False

def process_dif(dif, solved):
    dif = dif.lower()
    new_list = copy.deepcopy(solved)
    if dif == "easy":
        numbers_to_remove = 5
    elif dif =="medium":
        numbers_to_remove = 51
    elif dif == "hard":
        numbers_to_remove = 54
    for i in range(numbers_to_remove):
        x = random.randint(0,8)
        y = random.randint(0,8)
        new_list[x][y] = -1
    return new_list

def process_moves(gui, solved, unsolved):
    while not is_perfect(unsolved):
        gui.clear()
        x = int(input("what row do you want to attempt to solve? (1-9) "))
        y = int(input("what column do you want to attempt to solve? (1-9) "))
        guess = int(input("what is your guess? (1-9) "))
        if guess not in range(1,9) or x not in range(1,9) or y not in range(1,9):
            print("invalid guess")
        else:
            if (solved[x-1][y-1] == guess):
                unsolved[x-1][y-1] = guess
                print("you were correct!")
            else:
                print("you were incorrect!")
        draw_grid(gui, unsolved)
        gui.update_frame(60)
    print("YOU WON")

def draw_grid(gui, unsolved):
    gui.rectangle(0,0,700,700, "white")
    gui.text(280, 30, "SODOKU", "black", 25)
    x = 50
    y = 50
    for i in range(10):
        gui.line(x, 50, x, 500, "black")
        x += 50
        gui.line(50, y, 500, y, "black")
        y += 50

    x = 50
    y = 50
    for j in range(len(unsolved)):
        x = 50
        for k in range(len(unsolved[j])):
            if unsolved[j][k] != -1:
                gui.text(x + 20, y + 20, unsolved[j][k], 'black', 25)
            x += 50
        y += 50

    
    

def main():
    solved = []
    for i in range(9):
        temp = []
        for j in range(9):
            temp.append(-1)
        solved.append(temp)
    number_generator(solved)
    gui = graphics(600, 650, "sodoku")
    dif = input("what level of difficulty do you want(easy, medium, hard)? ")
    unsolved = process_dif(dif, solved)
    draw_grid(gui, unsolved)
    gui.update_frame(60)
    process_moves(gui, solved, unsolved)
    
    
main()
