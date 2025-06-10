import {ContactCard} from "../../components/ContctCard/ContactCard";
import ContactForm from '../../components/ContactForm/ContactForm';


export const ContactPage = () => {
  const contactDetails = [
    { title: "Police Emergency Number", number: "102" },
    { title: "Fire & Rescue", number: "101" },
    { title: "Ambulance Services", number: "108/102" },
    { title: "Women and Child Care", number: "181" }
  ];

  return (
    <div className="contact-page">
      <div className="wrapper">
        <div className="emergency">
          <h2>Emergency Contacts</h2>
          <div className="contact-cards">
            {contactDetails.map((contact, index) => (
              <ContactCard
                key={index}
                title={contact.title}
                number={contact.number}
              />
            ))}
          </div>
        </div>

        <div className="contact-us">
          <ContactForm />
          <p>
            If you have any queries, feel free to contact us via email or phone.
          </p>
          <ul>
            <li>
              <span>Email: </span>alert.dms@gmail.com
            </li>
            <li>
              <span>Phone: </span>9876543210
            </li>
            <li>
              <span>Address: </span>123 Main Street, Lucknow, UP, India
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

