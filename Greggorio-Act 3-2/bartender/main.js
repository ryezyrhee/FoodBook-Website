const searchForm = document.querySelector("form");
const searchResultDiv = document.querySelector(".search-result");
const container = document.querySelector(".container");
const maxButtonsToShow = 5;
let searchQuery = "";
const APP_ID = "81f5d692";
const APP_key = "00bb75718c52b8639d89b2a137fcb8a1";
let currentPage = 1; // Track the current page
const resultsPerPage = 20; // Number of results to display per page

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = e.target.querySelector("input").value;
  console.log(searchQuery);
  currentPage = 1; // Reset to the first page when a new search is performed
  fetchAPI();
});

async function fetchAPI() {
  const from = (currentPage - 1) * resultsPerPage;
  const to = currentPage * resultsPerPage;
  const baseURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_key}`
  const response = await fetch(baseURL);
  const data = await response.json();
  generateTitle();
  generateHTML(data.hits);
  console.log(data);
}

function generateHTML(results) {
    container.classList.remove("initial");
    let generatedHTML = "";
    
    // Define an array of colors to choose from
    const colors = ["#FF6347", "#F1C40F", "#FF6600"];
  
    results.forEach((result) => {
      // Select a random color from the array
    //   const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
      generatedHTML += `
        <div class="item fade-in">
          <img src="${result.recipe.image}" alt="img">
          <a class="view-btn" target="_blank" href="${result.recipe.url}">View Recipe</a>
          <h1 class="title">${result.recipe.label}</h1>
          <p class="item-data">Calories: ${result.recipe.calories.toFixed(2)}</p>
          <p class="item-data">Diet label: ${
            result.recipe.dietLabels.length > 0
              ? result.recipe.dietLabels
              : "No Data Found"
          }</p>
          <p class="item-data bottom">Caution: ${result.recipe.cautions}</p>
        </div>
      `;
    });
    searchResultDiv.innerHTML = generatedHTML;
  }
  function generateTitle(){
    let generatedTitle = `<h1 class="title"; You searched for ${searchQuery}>`;
    
    searchResultDiv.innerHTML = generatedTitle;
  }
  
  // Function to check if an element is in the viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Function to handle scroll and check if elements are in the viewport
  function handleScroll() {
    const elements = document.querySelectorAll(".fade-in");
  
    elements.forEach((element) => {
      if (isElementInViewport(element)) {
        element.classList.add("fade-in-active");
      }
    });
  }
  
  // Add a scroll event listener to trigger the animation
  window.addEventListener("scroll", handleScroll);
  
  // Initial check when the page loads
  handleScroll();
  

const NUTRITION_APP_ID = "19ff45e9";
const NUTRITION_APP_KEY = "43920b7f511a4d7ac1008b017697cefa";

// Input and button elements
const ingredientListInput = document.getElementById("ingredientList");
const analyzeButton = document.getElementById("analyzeButton");
const nutritionResultDiv = document.querySelector(".nutrition-result");
const loadingSpinner = document.getElementById("loadingSpinner");

// Event listener for the "Analyze Nutrition" button
analyzeButton.addEventListener("click", () => {
    const ingredientList = ingredientListInput.value;
    if (ingredientList) {
      loadingSpinner.style.display = "block";
        // Construct the API URL
        const nutritionURL = `https://api.edamam.com/api/nutrition-data?app_id=${NUTRITION_APP_ID}&app_key=${NUTRITION_APP_KEY}&nutrition-type=cooking&ingr=${ingredientList}`;

        // Make a GET request to the Nutrition API
        fetch(nutritionURL)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('API request failed');
                }
            })
            .then((nutritionData) => {
                // Handle the nutrition analysis response here
                displayNutritionData(nutritionData);
            })
            .catch((error) => {
                // Handle errors
                console.error(error);
            })
            .finally(() => {
                loadingSpinner.style.display = "none"; // Hide the loading icon after the request is complete
            });
    }
});

// Function to display nutrition analysis data
function displayNutritionData(nutritionData) {
  // Clear any previous results
  nutritionResultDiv.innerHTML = '';

  if (nutritionData.calories === 0) {
      nutritionResultDiv.innerHTML = '<p>No nutrition information available for the provided ingredients.</p>';
  } else {
      const nutritionHTML = `
          <div class="nutrition-facts">
              <h2>Nutrition Facts</h2>
              <p>Amount Per Serving</p>
              <div class="fact-row">
                  <span>Calories</span>
                  <span>${nutritionData.calories} kcal</span>
              </div>
              <div class="fact-row">
                  <span>Total Fat</span>
                  <span>${nutritionData.totalNutrients.FAT.quantity.toFixed(2)} ${nutritionData.totalNutrients.FAT.unit}</span>
              </div>
              <div class="fact-row">
                  <span>Saturated Fat</span>
                  <span>${nutritionData.totalNutrients.FASAT.quantity.toFixed(2)} ${nutritionData.totalNutrients.FASAT.unit}</span>
              </div>
              <div class="fact-row">
                  <span>Cholesterol</span>
                  <span>${nutritionData.totalNutrients.CHOLE.quantity.toFixed(2)} ${nutritionData.totalNutrients.CHOLE.unit}</span>
              </div>
              <div class="fact-row">
                    <span>Sodium</span>
                    <span>${nutritionData.totalNutrients.NA.quantity.toFixed(2)} ${nutritionData.totalNutrients.NA.unit}</span>
                </div>
                <div class="fact-row">
                    <span>Total Carbohydrate</span>
                    <span>${nutritionData.totalNutrients.CHOCDF.quantity.toFixed(2)} ${nutritionData.totalNutrients.CHOCDF.unit}</span>
                </div>
                <div class="fact-row">
                    <span>Protein</span>
                    <span>${nutritionData.totalNutrients.PROCNT.quantity.toFixed(2)} ${nutritionData.totalNutrients.PROCNT.unit}</span>
                </div>
                <div class="fact-row">
                    <span>Vitamin D</span>
                    <span>${nutritionData.totalNutrients.VITD.quantity.toFixed(2)} ${nutritionData.totalNutrients.VITD.unit}</span>
                </div>
                <div class="fact-row">
                    <span>Calcium</span>
                    <span>${nutritionData.totalNutrients.CA.quantity.toFixed(2)} ${nutritionData.totalNutrients.CA.unit}</span>
                </div>              
                <div class="fact-row">
                    <span>Potassium</span>
                    <span>${nutritionData.totalNutrients.K.quantity.toFixed(2)} ${nutritionData.totalNutrients.K.unit}</span>
                </div>
          </div>
      `;

      nutritionResultDiv.innerHTML = nutritionHTML;
  }
}
