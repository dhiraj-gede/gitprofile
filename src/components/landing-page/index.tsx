import LoginCard from '../auth/LoginForm/LoginCard';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center bg-base-200 py-16">
        <h1 className="text-4xl font-bold mb-4">
          Begin your journey to ace technical interviews today!
        </h1>
        <p className="text-lg text-opacity-70 mb-8">
          Embark on Your Learning Journey: Master DSA with Us and Excel in
          Interviews with Ease.
        </p>
      </section>

      {/* Sign In / Sign Up Card */}
      <section className="flex items-center justify-center py-16">
        <LoginCard />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-base-200">
        <h2 className="text-3xl font-semibold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-4">
          {[
            'Interactive Tutorials',
            'Practice Problems',
            'Mock Interviews',
          ].map((feature, index) => (
            <div key={index} className="card shadow-lg compact bg-base-100">
              <div className="card-body">
                <h3 className="font-semibold">{feature}</h3>
                <p className="text-opacity-60">
                  Discover how {feature.toLowerCase()} can enhance your learning
                  experience.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-base-200 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8">
          Join us today and take the first step towards success!
        </p>
        <a href="#contact" className="btn btn-primary">
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default LandingPage;
