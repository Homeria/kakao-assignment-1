import { useEffect, useState } from 'react'

// Repository의 load/save 함수를 React state와 연결하는 Hook입니다.
// 이 Hook은 localStorage를 직접 다루지 않고, 주입받은 저장소 함수만 호출합니다.
// 덕분에 컴포넌트는 "상태를 사용한다"는 일에 집중하고, 저장 방식은 Repository가 책임집니다.
export function useStoredState(loadValue, saveValue) {
    // 함수형 초기화를 사용해 저장소 읽기는 컴포넌트가 처음 만들어질 때 한 번만 실행합니다.
    const [value, setValue] = useState(() => {
        return loadValue()
    })

    // 상태가 바뀔 때마다 최신 값을 Repository를 통해 저장합니다.
    useEffect(() => {
        saveValue(value)
    }, [value, saveValue])

    return [value, setValue]
}
