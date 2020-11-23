import React, { useContext, useEffect } from "react";
import Link from 'next/link'
import SelectedContext from "../ctx/SelectedContext";

import { FiTrash, FiCodepen, FiShare } from "react-icons/fi";

export default function SelectionBar({ hideCreatePack }) {
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);

    if(selectedApps.length === 0) return <></>;

    let handleClear = () => {
      // check if confirm exists
      // support for iOS safari
      if ('confirm' in window && typeof window.confirm === 'function'){
        if(window.confirm("Are you sure you want to unselect all the apps?")){
            setSelectedApps([]);
        }
      } else{
        setSelectedApps([]);
      }
    }
    return (
      <div className="bottomBar">
        <div className="container inner">
          <div className="appPreview">
            <p>Selected {selectedApps.length} apps so far</p>
          </div>
          <div className="controls">
            <button className="clear small" onClick={() => handleClear()} title="Clear selections">
              <FiTrash />
            </button>
            { !hideCreatePack && (
              <Link href="/packs/create">
                <button disabled={selectedApps.length >= 5 ? false : true}>
                  <FiShare />
                  <em>{selectedApps.length >= 5 ? "Create Pack" : `Need ${Math.abs(5 - selectedApps.length)} more ${Math.abs(5 - selectedApps.length) === 1 ? "app" : "apps"} to create a pack.`}</em>
                </button>
              </Link>
            )}
            <Link href="/generate">
              <button>
                <FiCodepen />
                Generate script
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
}