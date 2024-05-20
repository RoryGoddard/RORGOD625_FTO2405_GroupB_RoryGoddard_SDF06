import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-cbd86-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

/* Pushes value from input field to the shoppingList database when the button is clicked, then clears input field */
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    push(shoppingListInDB, inputValue)
    clearInputFieldEl()
})

/* onValue is unique because whenever a change occurs in the database, it will trigger this function to occur of its own accord
Here we specify we are referring to the shoppingList DB, and it checks if it exists
If it does, we retrieve the values in the object in the database, and we call appendItemToShoppingListEl which will append the values to the UL as li elements
If it does not exist, we simply inform the user that there are no items to display yet */
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function clearShoppingListEl () {
    shoppingListEl.innerHTML = ""
}

/* Retrieves the item key and the item value, in order to either A) append values to the shopping list, 
or B) to use the key to delete key value pairs from the database */
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}
