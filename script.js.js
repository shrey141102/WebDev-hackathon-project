// JavaScript file (script.js)
document.addEventListener('DOMContentLoaded', function() {
    // Code to execute when the DOM is fully loaded
  
    // Add CSS styles dynamically
    var cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    cssLink.href = 'styles.css';
    document.head.appendChild(cssLink);
  
    // Create the HTML structure
    var header = document.createElement('header');
    var headerContainer = document.createElement('div');
    var headerText = document.createElement('h1');
    headerText.textContent = 'Your Website Header';
    headerContainer.appendChild(headerText);
    header.appendChild(headerContainer);
    document.body.appendChild(header);
  
    var nav = document.createElement('nav');
    var navContainer = document.createElement('div');
    var navList = document.createElement('ul');
    var navItems = ['Home', 'About', 'Services', 'Contact'];
    for (var i = 0; i < navItems.length; i++) {
      var navItem = document.createElement('li');
      var navLink = document.createElement('a');
      navLink.href = '#';
      navLink.textContent = navItems[i];
      navItem.appendChild(navLink);
      navList.appendChild(navItem);
    }
    navContainer.appendChild(navList);
    nav.appendChild(navContainer);
    document.body.appendChild(nav);
  
    var main = document.createElement('main');
    var mainContainer = document.createElement('div');
    var mainHeader = document.createElement('h2');
    mainHeader.textContent = 'Welcome to Your Website!';
    var mainContent = document.createElement('p');
    mainContent.textContent = 'This is the main content area of your website.';
    mainContainer.appendChild(mainHeader);
    mainContainer.appendChild(mainContent);
    main.appendChild(mainContainer);
    document.body.appendChild(main);
  
    var footer = document.createElement('footer');
    var footerContainer = document.createElement('div');
    var footerText = document.createElement('p');
    footerText.textContent = '© 2023 Your Website. All rights reserved.';
    footerContainer.appendChild(footerText);
    footer.appendChild(footerContainer);
    document.body.appendChild(footer);
  });
  