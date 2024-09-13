import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { Audio, RotatingTriangles } from 'react-loader-spinner';
import { connect, useSelector } from 'react-redux';
import { setLoader } from '../../store/action/loaderAction';

const Loader = (props) => {
  const { loader, setLoader } = props;
  // const [open, setOpen] = React.useState(false);
  const open = useSelector((state) => state.loader);

  const handleClose = () => {
    setLoader(false);
  };
  // const handleOpen = () => {
  //   setOpen(true);
  // };

  React.useEffect(() => {
    console.log("loader", open)
  }, [open]);

  return (
    <div>
      {/* <Button onClick={handleOpen}>Show backdrop</Button> */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <RotatingTriangles
          visible={true}
          height="100"
          width="100"
          colors={['#b4ffb4', '#b4ffb4', '#b4ffb4']}
          ariaLabel="rotating-triangles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </Backdrop>
    </div>
  );
};

const mapStateToProps = ( state ) => {
  const { loader } = state;
  return { loader };
};

export default connect( mapStateToProps, { setLoader } )(Loader);