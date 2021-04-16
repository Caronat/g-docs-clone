document.addEventListener("DOMContentLoaded", () => {
  const sidenav = document.querySelectorAll(".sidenav");
  const modals = document.querySelectorAll(".modal");
  const tooltipped = document.querySelectorAll(".tooltipped");
  const selects = document.querySelectorAll("select");
  const actionBtn = document.querySelectorAll(".fixed-action-btn");

  M.Sidenav.init(sidenav, {
    edge: "right",
  });
  M.Modal.init(modals);
  M.Tooltip.init(tooltipped, {
    margin: -20,
    transitionMovement: 22,
    outDuration: 0,
  });
  M.FormSelect.init(selects);
  M.FloatingActionButton.init(actionBtn, {
    direction: "left",
  });
});
