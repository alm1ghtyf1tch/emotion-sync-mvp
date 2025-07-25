import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t bg-background py-6 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <span className="text-sm text-muted-foreground">© 2025 EmotionSync</span>
        <nav className="flex flex-wrap gap-6 text-sm">
          <a href="/terms" className="hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded transition-colors">Terms of Service</a>
          <a href="/privacy" className="hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded transition-colors">Privacy Policy</a>
          <a href="/contact" className="hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded transition-colors">Contact</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
