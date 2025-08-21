import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// ✅ Accepting message and type as parameters
const topTost = (message = "Action Executed", type = "success") => {
  MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    // backdrop: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  }).fire({
    icon: type,        // ✅ dynamic (success, error, info)
    title: message     // ✅ dynamic (backend message)
  });
};

export default topTost;
