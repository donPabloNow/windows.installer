import Link from "next/link";
import MetaTags from "../components/MetaTags";
import Footer from "../components/Footer";

export default function Explainer() {
  return (
    <div className="container">
      <MetaTags title="winstall - how does it work?" />
      <article>
        <section>
          <h2>How does this app work?</h2>
          <p>
            winstall is powered by Windows Package Manager (aka "winget"),{" "}
            <a
              href="https://devblogs.microsoft.com/commandline/windows-package-manager-preview/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft's new package manager
            </a>{" "}
            for Windows 10. Windows Package Manager is currently in preview, and
            it is not available by default in Windows 10.
          </p>
        </section>

        <section>
          <h2>Installing Windows Package Manager</h2>
          <p>
            If you don't already have Windows Package Manager, you can install
            it by downloading and installing the{" "}
            <a
              href="https://github.com/microsoft/winget-cli/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              latest .appxbundle file from here.
            </a>
          </p>
        </section>

        <section>
          <h2>Using winstall</h2>
          <p>
            To use winstall, you can search for apps on the homepage.
            Additionally, you can also view all the apps available via Windows
            Package Manager{" "}
            <Link href="/apps">
              <a>on this page.</a>
            </Link>
          </p>
          <p>
            Simply select the apps you want to download and click on the
            "Generate Script" button at the bottom of the screen. You will then
            be presented with a command that you can copy and paste into any
            Windows command-line. Input that into a command line app of your
            choice, and hit enter to start installing the apps one-by-one using
            Windows Package Manager. You can also generate a PowerShell script by toggling
            the "Show Powershell script" option.
          </p>
          <p>
            Alternatively, you can click on the "Download .bat/.ps1" button which
            will download a batch file. However, you will likely get a security
            warning from your browser. In that case, ignore the warning as the
            batch file is completely secure. Once downloaded, you can
            double-click the .bat/ file to install the apps using the Windows
            Package Manager.
          </p>
        </section>

        <section>
          <h2>How is the data obtained?</h2>
          <p>
            winstall is powered by an API that I have built. The API regularly checks Microsoft's {" "}
            <a
              href="https://github.com/microsoft/winget-pkgs"
              target="_blank"
              rel="noopener noreferrer"
            >
              official repository
            </a>{" "}
            for Windows Package Manager apps. This means it always provides the latest data.
          </p>
          <p>The API updates its data every 15 minutes on weekdays, and every 3 hours on weekends. I will be making the API open-source in the near-future.</p>
        </section>

        <section>
          <h2>Contributing and reporting bugs</h2>
          <p>
            winstall is completely open-source, and you can{" "}
            <a
              href="https://github.com/MehediH/winstall"
              target="_blank"
              rel="noopener noreferrer"
            >
              find the source code here. 
            </a>{" "}
            If you run into any issues, please report it{" "}
              <a
                href="https://github.com/MehediH/winstall/issues/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                using GitHub Issues here.
           
            </a>
          </p>

        </section>
      </article>
      <Footer/>
    </div>
  );
}
