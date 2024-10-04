interface AboutSectionProps {
  shortBio: string;
  followersCount: number;
  loading: boolean;
}

const AboutSection = ({
  shortBio,
  followersCount,
  loading,
}: AboutSectionProps) => {
  if (loading) {
    return (
      <div className="card shadow-lg compact bg-base-100">
        <div className="card-body">
          <div className="animate-pulse">
            <div className="h-6 bg-base-300 rounded"></div>
            <div className="h-4 bg-base-300 rounded mt-2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-lg compact bg-base-100">
      <div className="card-body">
        <div className="text-base-content text-opacity-60">
          <h2 className="text-2xl font-bold">About</h2>
          <p className="text-lg">{shortBio || 'No bio available.'}</p>
          <p className="text-sm">Followers: {followersCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
