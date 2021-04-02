import jQuery from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

jQuery(() => {
  console.info('init modal');
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
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
    </div>`).appendTo($body);
  const $modalTitle = $modal.find('.modal-title');
  const $modalBody = $modal.find('.modal-body');
  jQuery(`.albums li`).on('click', (item) => {
    console.debug('clicked');
    const $item = jQuery(item);
    const title = $item.text();
    const coverSource = $item.data('cover');
    $modalTitle.text(title);
    const tags = $item.data('tags');
    $modalBody.html(`<div class="text-center">
    <img src="${coverSource}" class="rounded mx-auto d-block" alt="${title}">
    <p>${tags}</p>
    </div>`);
    $modal.modal();
  });
});
