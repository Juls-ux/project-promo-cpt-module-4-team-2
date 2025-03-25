import PropTypes from 'prop-types';
import PreviewCard from './PreviewCard';

function Preview({formData}) {
  return (
    <section className="preview">
      <div className="projectImage" style={{ backgroundImage: formData.image ? `url(${formData.image})` : null }}></div>
      <PreviewCard formData={formData} />
    </section>
  );
}

Preview.propTypes = {
formData: PropTypes.object.isRequired,
}

export default Preview;
