// First attempt! Good luck me ^=^ :)

#include <iostream>
#include <string>

int main(){
    // declare integer vars to store numbers 
    int firstnumber;
    int secondnumber;
    char operation;
    int result;

    std::cout << "Heyyyy - try my simple calculator!" << std::endl;
    std::cout << "This calcualtor can only take in 2 numbers for now. Soweeeee :-(" << std::endl;
    std::cout << "DUN DUN DUNNNNNNNNN - I know - you probably just want to use the damn calculator!" << std::endl;
    std::cout << "DUN DUN DUNNNNNNNNN - I know - you probably just want to use the damn calculator!" << std::endl;
    std::cout << "Just give me " << std::endl;
    std::cout << "One more...." << std::endl;
    std::cout << "Sec.....Joking loooool. enter your first number broski :-P" << std::endl;

    std::cin >> firstnumber;
    std::cout << "Now your second. Chop chop fam" << std::endl;
    std::cin >> secondnumber;

    std::cout << "THIS is where it starts to get techyyyyy (^_^*)" << std::endl;
    std::cout << "Now big man - how you wanna handle these numbers - chat to man" << std::endl;
    std::cout << "Pick an operation - WARNING -assumes you know basic maths!" << std::endl;
    std::cout << "So pick one bad man! (+, -, *, /): ";
    std::cin >> operation;

    if (operation == '+'){
        result = firstnumber + secondnumber;
    }else if(operation == '-'){
        result = firstnumber - secondnumber;
    }else if(operation == '*'){
        result = firstnumber * secondnumber;
    }else if(operation == '/'){
        if (secondnumber != 0){
            result = firstnumber / secondnumber;
        }else{
            std::cout << "You can't divide by zero, you absolute EGGhead!" << std::endl;
            return 1; // Error code for division by zero
        }
    } else {
        std::cout << "Bruh... that ain't even a valid operation! 😑" << std::endl;
        return 1; // Error code for invalid operation
    
}
    std::cout << "Your result is this innit" << result << std::endl;
    return 0;
}