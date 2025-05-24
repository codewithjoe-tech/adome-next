import { Spinner } from '@/app/components/ui/spinner';
import React from 'react'

type Props = {
    communities: any;
    setSelectedCommunity : (community:any)=>void;
    selectedCommunity : any
    communitiesLoading : boolean
}

const CommunitySidebar = ({communities , setSelectedCommunity , selectedCommunity , communitiesLoading}: Props) => {
  return (
       <div className="w-64 bg-sidebar flex-shrink-0 border-r border-sidebar-border">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground text-gradient">Communities</h2>
          <ul className="mt-4 space-y-2">
            {
              communitiesLoading && <Spinner />
            }
            {communities && communities.map((community: any) => (
              <li key={community.id}>
                <button
                  onClick={() => setSelectedCommunity(community)}
                  className={`w-full flex items-center p-2 rounded-md text-sm ${
                    selectedCommunity.id === community.id
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <span className="mr-2">{community.icon}</span>
                  {community.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
  )
}

export default CommunitySidebar