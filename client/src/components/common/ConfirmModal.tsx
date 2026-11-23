interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({show, title, message, onConfirm, onCancel}: ConfirmModalProps) {
  if (!show) return null;
  return (
    <>
    <div className="modal-backdrop fade show"></div>
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">{title}</h5>
              <button type="button" className="btn-close" onClick={onCancel} aria-label="Close" />
            </div>
            <div className="modal-body">
              <p className="mb-0">{message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>No</button>
              <button type="button" className="btn btn-danger" onClick={onConfirm}>Yes</button>
            </div>
          </div>
        </div>
    </div>
    </>
  );
}

export default ConfirmModal;