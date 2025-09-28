'use client';

import { ResumeVersion } from '@/types/resume';

interface VersionDiffProps {
  versionA: ResumeVersion | null;
  versionB: ResumeVersion | null;
}

interface DiffResult {
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  content: string;
  originalIndex?: number;
}

function simpleDiff(bulletsA: string[], bulletsB: string[]): DiffResult[] {
  const result: DiffResult[] = [];
  const maxLength = Math.max(bulletsA.length, bulletsB.length);
  
  for (let i = 0; i < maxLength; i++) {
    const bulletA = bulletsA[i];
    const bulletB = bulletsB[i];
    
    if (!bulletA && bulletB) {
      // Added
      result.push({ type: 'added', content: bulletB });
    } else if (bulletA && !bulletB) {
      // Removed
      result.push({ type: 'removed', content: bulletA, originalIndex: i });
    } else if (bulletA && bulletB) {
      if (bulletA === bulletB) {
        // Unchanged
        result.push({ type: 'unchanged', content: bulletA, originalIndex: i });
      } else {
        // Modified
        result.push({ type: 'modified', content: bulletB, originalIndex: i });
      }
    }
  }
  
  return result;
}

export default function VersionDiff({ versionA, versionB }: VersionDiffProps) {
  if (!versionA || !versionB) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Please select both versions to compare.</p>
      </div>
    );
  }

  const contentA = versionA.content as any;
  const contentB = versionB.content as any;
  
  const blocksA = contentA?.blocks || [];
  const blocksB = contentB?.blocks || [];

  // Create a map of blocks by type for easier comparison
  const blocksByTypeA = blocksA.reduce((acc: any, block: any) => {
    if (!acc[block.type]) acc[block.type] = [];
    acc[block.type].push(block);
    return acc;
  }, {});

  const blocksByTypeB = blocksB.reduce((acc: any, block: any) => {
    if (!acc[block.type]) acc[block.type] = [];
    acc[block.type].push(block);
    return acc;
  }, {});

  const allTypes = new Set([...Object.keys(blocksByTypeA), ...Object.keys(blocksByTypeB)]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800">Version A</h3>
          <p className="text-sm text-blue-600">{versionA.label}</p>
          <p className="text-xs text-blue-500">
            {new Date(versionA.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800">Version B</h3>
          <p className="text-sm text-green-600">{versionB.label}</p>
          <p className="text-xs text-green-500">
            {new Date(versionB.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {Array.from(allTypes).map((type) => {
          const blocksA = blocksByTypeA[type] || [];
          const blocksB = blocksByTypeB[type] || [];
          
          return (
            <div key={type} className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-4 capitalize">
                {type} Section
              </h4>
              
              <div className="space-y-4">
                {blocksA.map((blockA: any, blockIndex: number) => {
                  const blockB = blocksB[blockIndex];
                  
                  if (!blockB) {
                    // Block removed
                    return (
                      <div key={`removed-${blockIndex}`} className="p-3 bg-red-50 border-l-4 border-red-200">
                        <h5 className="font-medium text-red-800 line-through">{blockA.title}</h5>
                        <div className="mt-2 space-y-1">
                          {blockA.details.map((detail: string, detailIndex: number) => (
                            <p key={detailIndex} className="text-sm text-red-600 line-through">
                              • {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  const diff = simpleDiff(blockA.details || [], blockB.details || []);
                  
                  return (
                    <div key={`block-${blockIndex}`} className="border rounded p-3">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium text-gray-800">
                          {blockA.title === blockB.title ? blockA.title : `${blockA.title} → ${blockB.title}`}
                        </h5>
                        {blockA.title !== blockB.title && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Title Changed
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {diff.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className={`p-2 rounded text-sm ${
                              item.type === 'added'
                                ? 'bg-green-100 text-green-800 border-l-4 border-green-300'
                                : item.type === 'removed'
                                ? 'bg-red-100 text-red-800 border-l-4 border-red-300 line-through'
                                : item.type === 'modified'
                                ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-300'
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            <span className="font-medium">
                              {item.type === 'added' && '+ '}
                              {item.type === 'removed' && '- '}
                              {item.type === 'modified' && '~ '}
                              {item.type === 'unchanged' && '  '}
                            </span>
                            {item.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {/* Handle blocks that exist only in B */}
                {blocksB.slice(blocksA.length).map((blockB: any, blockIndex: number) => (
                  <div key={`added-${blocksA.length + blockIndex}`} className="p-3 bg-green-50 border-l-4 border-green-200">
                    <h5 className="font-medium text-green-800">+ {blockB.title}</h5>
                    <div className="mt-2 space-y-1">
                      {blockB.details.map((detail: string, detailIndex: number) => (
                        <p key={detailIndex} className="text-sm text-green-600">
                          + {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {allTypes.size === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No content to compare.</p>
        </div>
      )}
    </div>
  );
}
