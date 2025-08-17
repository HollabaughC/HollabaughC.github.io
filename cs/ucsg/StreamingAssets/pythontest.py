import turtle
#TODO: import turtle
jj = turtle.Turtle()

#TODO: create a for loop to draw a square
for i in range(4):
    #TODO: make jj change from blue to red with each line
    if(i %2 == 0):
        jj.color = 'blue'
    else:
        jj.color = 'red'
    #TODO: make jj draw a line and turn to prepare for next iteration
    jj.fd(50)
    jj.right(90)
