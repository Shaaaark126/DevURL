function loadlocation(){

    fetch('/location')
        .then(response => {
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            window.location.href = response.url;
        })
        .catch(error => {
            
            console.error('Error fetching data:', error);
        });
}

function loadleaderboard(){

    fetch('/table')
        .then(response => {
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            window.location.href = response.url;
        })
        .catch(error => {
            
            console.error('Error fetching data:', error);
        });
}

function loadoutreach(){

    fetch('/outreach')
        .then(response => {
        
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            window.location.href = response.url;
        })
        .catch(error => {
            
            console.error('Error fetching data:', error);
        });
}




