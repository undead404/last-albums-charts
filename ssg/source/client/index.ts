import jQuery from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

jQuery(() => {
  const $body = jQuery('body');
  const $modal = jQuery(`<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title">Modal title</h3>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          ...
        </div>
      </div>
    </div>
    </div>`).appendTo($body);
  const $modalTitle = $modal.find('.modal-title');
  const $modalBody = $modal.find('.modal-body');
  jQuery(`.albums li`).on('click', (event) => {
    const $item = jQuery(event.target);
    const title = $item.text();
    const coverSource = $item.data('cover');
    $modalTitle.text(title);
    const tags = $item.data('tags');
    $modalBody.html(`<div class="text-center">
    <img src="${coverSource}" class="rounded mx-auto d-block w-100" alt="${title}">
    <p class="text-justify">${tags}</p>
    </div>`);
    $modal.modal();
  });
});
