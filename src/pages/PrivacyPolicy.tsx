
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <p className="text-lg">
              Last Updated: May 3, 2025
            </p>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Welcome to Examify. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our 
                website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. The Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have 
                grouped together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, 
                  time zone setting and location, browser plug-in types and versions, operating system and platform, 
                  and other technology on the devices you use to access this website.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products, and services.</li>
                <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing 
                  from us and our third parties and your communication preferences.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your 
                personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests and your interests and fundamental rights 
                  do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being 
                accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, 
                we limit access to your personal data to those employees, agents, contractors, and other third 
                parties who have a business need to know.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
              <p>
                We will only retain your personal data for as long as reasonably necessary to fulfill the purposes 
                we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting 
                or reporting requirements.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Cookie Policy</h2>
              <p>
                Our website uses cookies to distinguish you from other users of our website. This helps us to provide 
                you with a good experience when you browse our website and also allows us to improve our site.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Changes to the Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of significant changes by 
                posting the new privacy policy on this page and updating the "Last Updated" date at the top of this page.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at:<br />
                Email: privacy@examify.com<br />
                Postal address: 123 Learning Street, Education City, ED 12345
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
