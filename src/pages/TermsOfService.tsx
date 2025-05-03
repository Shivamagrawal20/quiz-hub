
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <p className="text-lg">
              Last Updated: May 3, 2025
            </p>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using the QuizHub platform, you agree to be bound by these Terms of Service and all applicable 
                laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing 
                this site.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily access the materials (information or software) on QuizHub's website for 
                personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose or for any public display;</li>
                <li>Attempt to reverse engineer any software contained on QuizHub's website;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
              <p>
                This license shall automatically terminate if you violate any of these restrictions and may be terminated by 
                QuizHub at any time.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p>
                When you create an account with us, you guarantee that the information you provide is accurate, complete, and 
                current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination 
                of your account on the Service.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account and password, including but not limited 
                to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all 
                activities or actions that occur under your account and/or password.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
              <p>
                The Service and its original content (excluding content provided by users), features, and functionality are and 
                will remain the exclusive property of QuizHub and its licensors. The Service is protected by copyright, trademark, 
                and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in 
                connection with any product or service without the prior written consent of QuizHub.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. User Content</h2>
              <p>
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, 
                graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or 
                through the Service, including its legality, reliability, and appropriateness.
              </p>
              <p>
                By posting Content on or through the Service, You represent and warrant that: (i) the Content is yours (you own it) 
                and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms, 
                and (ii) that the posting of your Content on or through the Service does not violate the privacy rights, publicity 
                rights, copyrights, contract rights or any other rights of any person or entity.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Links To Other Web Sites</h2>
              <p>
                Our Service may contain links to third-party websites or services that are not owned or controlled by QuizHub.
              </p>
              <p>
                QuizHub has no control over, and assumes no responsibility for the content, privacy policies, or practices of 
                any third-party websites or services. We do not warrant the offerings of any of these entities/individuals or 
                their websites.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or 
                liability, under our sole discretion, for any reason whatsoever and without limitation, including but not 
                limited to a breach of the Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation Of Liability</h2>
              <p>
                In no event shall QuizHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable 
                for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of 
                profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or 
                inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) 
                any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions 
                or content, whether based on warranty, contract, tort (including negligence) or any other legal theory.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is 
                material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a 
                material change will be determined at our sole discretion.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:<br />
                Email: terms@quizhub.com<br />
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

export default TermsOfService;
