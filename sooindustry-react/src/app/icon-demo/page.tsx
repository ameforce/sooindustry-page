import { iconCatalog } from "@/data/icons";

export default function IconDemoPage() {
  return (
    <div className="wrapper py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-4">Nucleo Icons</h1>
          <p className="lead text-muted">Paper Kit에 포함된 모든 nc-icon 모음을 확인하세요.</p>
        </div>

        <div className="row">
          {iconCatalog.map((icon) => (
            <div key={icon.className} className="col-md-3 col-sm-4 col-6 mb-4">
              <div className="icon-card">
                <div className="icon-display">
                  <i className={`nc-icon ${icon.className}`} aria-hidden="true" />
                </div>
                <div className="icon-info">
                  <div className="icon-name">{icon.name}</div>
                  <div className="icon-class">{icon.className}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
