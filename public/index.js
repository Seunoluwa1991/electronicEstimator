// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {getDatabase, ref, set} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBmrhgvs0GH_tJIpmkoomqMmVlQWrq0RzE",
    authDomain: "market-app-estimator.firebaseapp.com",
    projectId: "market-app-estimator",
    storageBucket: "market-app-estimator.appspot.com",
    messagingSenderId: "234270117097",
    appId: "1:234270117097:web:63bd4801c0232b21e57478",
    measurementId: "G-945ELFGDDH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app)

const submit = document.getElementById("submit").addEventListener('click', function(event){
    event.preventDefault()
    let productName = document .getElementById("productName").value;
    let brandName = document.getElementById('brand').value;
    let modelName = document.getElementById('model').value;
    let conditionName = document.getElementById("condition").value;
    let electronicsAge = document.getElementById("electronicsAge").value;
    let originalPriceName = document.getElementById('originalPrice').value;

    if(!productName || !brandName || !modelName || !conditionName || !electronicsAge || !originalPriceName ){
        alert("Please Fill in the form completely");
        return;
    }

    let originalPrice = parseFloat(originalPriceName);
    let age = parseInt(electronicsAge);
    const displayestimatedPrice = document.getElementById("estimatedPrice");

    // estimate Price

      let estimatedPrice= estimatePrice(originalPrice, age, conditionName)
      if(estimatedPrice === null){
        return
      }

    const estimatorObject = {
        productName,
        brandName,
        modelName,
        conditionName,
        electronicsAge,
        originalPriceName
    } 
    console.log(estimatorObject)


    set(ref(database, 'priceEstimator/' + productName),estimatorObject)
    .then(()=>{
        alert("save successfully")
        console.log('save successfully')
    })
    .catch(()=>{
        alert('Not saved:' + error.message);
        console.log("unsaved data")
    })
        estimatedValue(estimatedPrice);
})

//     onValue(ref(database, "priceEstimator/" + productName), (snapshot)=>{
//         if (snapshot.exists()){
//             const estimatedInfo = snapshot.val()
//             console.log(estimatedInfo)
//             estimatedValue(estimatedInfo)
//         } else{
//             console.log('Error message: No data Available' )
//         }

//     }
// );

function estimatePrice(originalPrice, age, condition){
    let depreciationRate = 0.1;
    let priceMultiplierRate = 1;

    // new device, fairly used, refurbished

    if(condition === "fairly used"){
        priceMultiplierRate = 0.8;
    } else if( condition === "Refurbished"){
        priceMultiplierRate = 0.7;
    } else if( condition === "New device"){
        priceMultiplierRate = 1;
    }

    let estimatedPrice = originalPrice * priceMultiplierRate * Math.pow((1 - depreciationRate),age);

    let finalResult =Math.max(estimatedPrice, originalPrice * 0.1)
    console.log(finalResult)
    return finalResult;

}

function estimatedValue(estimatedPrice){
    document.getElementById('estimatedPrice').innerHTML =`
    <div class='container shadow border border-2 border-primary mt-5 p-5'>

            <h1 class="text-center">Estimated Price: $${estimatedPrice} </h1>

    </div>
    
    `

};

// console.log(estimatePrice())
// estimatePrice( 34, 2, 3000)

