#include <iostream>
#include <thread>  // For sleep_for
#include <chrono>  // For time durations

// Function to create the typing effect
void typeText(std::string text, int delay = 50) {  
    for (char c : text) { 
        std::cout << c << std::flush; // Print one character at a time
        std::this_thread::sleep_for(std::chrono::milliseconds(delay)); // Delay between characters
    }
    std::cout << std::endl; // Move to the next line
}

int main() {
      // declare integer vars to store numbers 
      int firstnumber;
      int secondnumber;
      char operation;
      int result;

    std::string messages[] = {
        "Heyyyy - try my simple calculator!",
        "This calculator can only take in 2 numbers for now. Soweeeee :-(",
        "DUN DUN DUNNNNNNNNN - I know - you probably just want to use the damn calculator!",
        "Just give me ",
        "One more....",
        "Sec..... Joking loooool. Enter your first number broski :-P"
    };

    int size = sizeof(messages) / sizeof(messages[0]);  // Get array size

    for (int i = 0; i < size; i++) {
        typeText(messages[i], 50); // Call typing function with a 50ms delay
        std::this_thread::sleep_for(std::chrono::milliseconds(300)); // Pause between lines
    }

     std::cin >> firstnumber;
    std::cout << "Now your second. Chop chop fam" << std::endl;
    std::cin >> secondnumber;

    std::string messages2[] = {
        "THIS is where it starts to get techyyyyy (^_^*)",
        "Now big man - how you wanna handle these numbers - chat to man", 
        "Pick an operation - WARNING -assumes you know basic maths!",
        "So pick one bad man! (+, -, *, /): "
    };

    int size2 = sizeof(messages2) / sizeof(messages2[0]);  // Get array size

    for (int i2 = 0; i2 < size2; i2++) {
        typeText(messages2[i2], 50); // Call typing function with a 50ms delay
        std::this_thread::sleep_for(std::chrono::milliseconds(300)); // Pause between lines
    }

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
    std::cout << "Your result is this innit: " << result << std::endl;

    return 0;
}
