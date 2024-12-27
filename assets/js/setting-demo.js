var toggle_customSidebar = false,
  custom_open = 0;

if (!toggle_customSidebar) {

  var toggle = $(".custom-template .custom-toggle");

  toggle.on("click", function () {
    if (custom_open == 1) {
      $(".custom-template").removeClass("open");
      toggle.removeClass("toggled");
      custom_open = 0;
    } else {
      $(".custom-template").addClass("open");
      toggle.addClass("toggled");
      custom_open = 1;
    }
  });

  // Event listener for the Apply button
  $(".apply-button").on("click", function () {
    // Close the sidebar and reset toggle state
    if (custom_open == 1) {
      $(".custom-template").removeClass("open");
      toggle.removeClass("toggled");
      custom_open = 0;
    }
  });

  toggle_customSidebar = true;

}
